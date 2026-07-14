package com.speakwise.speakwise.dto;



import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SessionSummaryResponse {
    private Long sessionId;
    private String questionText;
    private LocalDateTime createdAt;
    private Double wpm;
    private Double relevanceScore;
}
