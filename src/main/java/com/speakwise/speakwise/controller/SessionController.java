package com.speakwise.speakwise.controller;



import com.speakwise.speakwise.dto.ReportResponse;
import com.speakwise.speakwise.dto.SessionSummaryResponse;
import com.speakwise.speakwise.model.User;
import com.speakwise.speakwise.repository.UserRepository;
import com.speakwise.speakwise.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    private final UserRepository userRepository;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ReportResponse> createSession(
            Authentication authentication,
            @RequestParam("questionId") Long questionId,
            @RequestParam("audio") MultipartFile audio) {

        User user = currentUser(authentication);
        return ResponseEntity.ok(sessionService.createSession(user, questionId, audio));
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<ReportResponse> getReport(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getReport(id));
    }

    @GetMapping
    public ResponseEntity<List<SessionSummaryResponse>> getHistory(Authentication authentication) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(sessionService.getHistory(user));
    }

    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new com.speakwise.speakwise.exception.ApiException("User not found", 404));
    }
}
