package com.speakwise.speakwise.service;


import com.speakwise.speakwise.dto.ReportResponse;
import com.speakwise.speakwise.dto.SessionSummaryResponse;
import com.speakwise.speakwise.exception.ApiException;
import com.speakwise.speakwise.model.*;
import com.speakwise.speakwise.repository.PracticeSessionRepository;
import com.speakwise.speakwise.repository.QuestionRepository;
import com.speakwise.speakwise.repository.SpeechReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final QuestionRepository questionRepository;
    private final PracticeSessionRepository sessionRepository;
    private final SpeechReportRepository reportRepository;
    private final FileStorageService fileStorageService;
    private final SpeechToTextService speechToTextService;
    private final AnalysisEngine analysisEngine;
    private final RelevanceChecker relevanceChecker;
    private final EmailService emailService;

    public ReportResponse createSession(User user, Long questionId, MultipartFile audioFile) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ApiException("Question not found", 404));

        File storedFile = fileStorageService.store(audioFile);

        PracticeSession session = new PracticeSession();
        session.setUser(user);
        session.setQuestion(question);
        session.setAudioFilePath(storedFile.getAbsolutePath());

        TranscriptResult transcriptResult = speechToTextService.transcribe(storedFile);
        session.setTranscript(transcriptResult.getText());
        sessionRepository.save(session);

        double wpm = analysisEngine.calculateWPM(transcriptResult);
        int pauses = analysisEngine.detectPauses(transcriptResult);
        int fillerCount = analysisEngine.countFillerWords(transcriptResult.getText());

        RelevanceChecker.RelevanceResult relevance = relevanceChecker.check(transcriptResult.getText(), question);

        SpeechReport report = new SpeechReport();
        report.setSession(session);
        report.setWpm(wpm);
        report.setPauseCount(pauses);
        report.setFillerCount(fillerCount);
        report.setRelevanceScore(relevance.score);
        report.setMissingKeyPoints(String.join(", ", relevance.missingKeyPoints));
        report.setTipMessage(buildTip(wpm, pauses, fillerCount, relevance));
        reportRepository.save(report);

        emailService.sendReportEmail(user.getEmail(), question.getText(), wpm, relevance.score);

        return toReportResponse(session, question, report);
    }

    public ReportResponse getReport(Long sessionId) {
        PracticeSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ApiException("Session not found", 404));
        SpeechReport report = reportRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ApiException("Report not found for this session", 404));

        return toReportResponse(session, session.getQuestion(), report);
    }

    public List<SessionSummaryResponse> getHistory(User user) {
        return sessionRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(s -> new SessionSummaryResponse(
                        s.getId(),
                        s.getQuestion().getText(),
                        s.getCreatedAt(),
                        s.getSpeechReport() != null ? s.getSpeechReport().getWpm() : null,
                        s.getSpeechReport() != null ? s.getSpeechReport().getRelevanceScore() : null
                ))
                .toList();
    }

    private String buildTip(double wpm, int pauses, int fillerCount, RelevanceChecker.RelevanceResult relevance) {
        if (relevance.offTopic) return "Your answer strayed off-topic — try to directly address the key points expected in the question.";
        if (wpm < 110) return "You're speaking a bit slowly — aim for 130-160 WPM for a confident pace.";
        if (wpm > 170) return "You're speaking quite fast — slow down slightly so the interviewer can follow easily.";
        if (fillerCount > 5) return "Watch your filler words (um, like, actually) — pausing silently reads as more confident.";
        if (pauses > 3) return "Several long pauses detected — practice this answer a few more times to build fluency.";
        return "Solid answer! Good pace, low filler count, and you covered the key points.";
    }

    private ReportResponse toReportResponse(PracticeSession session, Question question, SpeechReport report) {
        return new ReportResponse(
                session.getId(),
                question.getId(),
                question.getText(),
                session.getTranscript(),
                report.getWpm(),
                report.getPauseCount(),
                report.getFillerCount(),
                report.getRelevanceScore(),
                report.getMissingKeyPoints(),
                report.getTipMessage()
        );
    }
}
