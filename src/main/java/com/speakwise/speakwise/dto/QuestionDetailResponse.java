package com.speakwise.speakwise.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class QuestionDetailResponse {
    private Long id;
    private String text;
    private String category;
    private List<String> expectedKeyPoints;
}