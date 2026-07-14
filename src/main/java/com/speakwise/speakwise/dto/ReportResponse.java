package com.speakwise.speakwise.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReportResponse {
    private Long sessionId;
    private Long questionId;
    private String questionText;
    private String transcript;
    private double wpm;
    private int pauseCount;
    private int fillerCount;
    private double relevanceScore;
    private String missingKeyPoints;
    private String tipMessage;
}