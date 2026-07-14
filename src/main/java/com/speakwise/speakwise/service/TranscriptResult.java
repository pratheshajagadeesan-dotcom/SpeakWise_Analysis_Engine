package com.speakwise.speakwise.service;



import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class TranscriptResult {
    private String text;
    private List<WordTiming> wordTimings;
    private double durationSeconds;

    @Getter
    @AllArgsConstructor
    public static class WordTiming {
        private String word;
        private double startSeconds;
        private double endSeconds;
    }
}
