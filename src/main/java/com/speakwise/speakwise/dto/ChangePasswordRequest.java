package com.speakwise.speakwise.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {
    @NotBlank
    private String currentPassword;

    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String newPassword;
}