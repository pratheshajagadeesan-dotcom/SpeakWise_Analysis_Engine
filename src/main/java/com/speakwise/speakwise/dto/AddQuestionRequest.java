package com.speakwise.speakwise.dto;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AddQuestionRequest {
    @NotBlank
    private String text;

    private String category;

    @NotEmpty(message = "At least one expected key point is required")
    private List<String> expectedKeyPoints;
}
