package com.speakwise.speakwise.service;
import com.speakwise.speakwise.model.FillerWord;
import com.speakwise.speakwise.repository.FillerWordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Service
@RequiredArgsConstructor
public class AnalysisEngine {
    private final FillerWordRepository fillerWordRepository;
    private static final double PAUSE_THRESHOLD_SECONDS = 2.0;
    public double calculateWPM(TranscriptResult result) {
        int wordCount = result.getWordTimings().size();
        double minutes = result.getDurationSeconds() / 60.0;
        if (minutes <= 0) return 0;
        return Math.round((wordCount / minutes) * 10.0) / 10.0;
    }
    public int detectPauses(TranscriptResult result) {
        List<TranscriptResult.WordTiming> timings = result.getWordTimings();
        int pauses = 0;
        for (int i = 1; i < timings.size(); i++) {
            double gap = timings.get(i).getStartSeconds() - timings.get(i - 1).getEndSeconds();
            if (gap > PAUSE_THRESHOLD_SECONDS) {
                pauses++;
            }
        }
        return pauses;
    }
    public int countFillerWords(String transcript) {
        List<String> fillerWords = fillerWordRepository.findAll()
                .stream().map(FillerWord::getWord).toList();
        int count = 0;
        String lowerTranscript = transcript.toLowerCase();
        for (String filler : fillerWords) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(filler.toLowerCase()) + "\\b");
            Matcher matcher = pattern.matcher(lowerTranscript);
            while (matcher.find()) {
                count++;
            }
        }
        return count;
    }
}
