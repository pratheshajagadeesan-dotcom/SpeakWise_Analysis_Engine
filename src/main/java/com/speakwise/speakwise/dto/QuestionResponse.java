
package com.speakwise.speakwise.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuestionResponse {
    private Long id;
    private String text;
    private String category;
}