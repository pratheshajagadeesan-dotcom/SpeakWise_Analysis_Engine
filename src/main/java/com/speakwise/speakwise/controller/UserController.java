package com.speakwise.speakwise.controller;

import com.speakwise.speakwise.dto.ChangePasswordRequest;
import com.speakwise.speakwise.dto.UpdateProfileRequest;
import com.speakwise.speakwise.dto.UserProfileResponse;
import com.speakwise.speakwise.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfile(authentication.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(authentication.getName(), request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(authentication.getName(), request);
        return ResponseEntity.noContent().build();
    }
}