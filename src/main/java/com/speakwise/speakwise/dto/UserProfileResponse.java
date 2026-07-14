package com.speakwise.speakwise.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
}