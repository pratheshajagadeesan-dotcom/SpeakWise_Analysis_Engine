package com.speakwise.speakwise.service;


import com.speakwise.speakwise.model.ExpectedKeyPoint;
import com.speakwise.speakwise.model.Question;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RelevanceChecker {

    private static final double OFF_TOPIC_THRESHOLD = 30.0;

    public static class RelevanceResult {
        public double score;
        public List<String> missingKeyPoints;
        public boolean offTopic;
    }

    public RelevanceResult check(String transcript, Question question) {
        String lowerTranscript = transcript.toLowerCase();
        List<ExpectedKeyPoint> keyPoints = question.getExpectedKeyPoints();

        List<String> missing = new ArrayList<>();
        int mentioned = 0;

        for (ExpectedKeyPoint kp : keyPoints) {
            if (lowerTranscript.contains(kp.getKeyword().toLowerCase())) {
                mentioned++;
            } else {
                missing.add(kp.getKeyword());
            }
        }

        RelevanceResult result = new RelevanceResult();
        result.score = keyPoints.isEmpty() ? 0 : Math.round((mentioned / (double) keyPoints.size()) * 1000.0) / 10.0;
        result.missingKeyPoints = missing;
        result.offTopic = result.score < OFF_TOPIC_THRESHOLD;
        return result;
    }
}