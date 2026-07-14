package com.speakwise.speakwise.controller;

import com.speakwise.speakwise.dto.AddQuestionRequest;
import com.speakwise.speakwise.dto.QuestionDetailResponse;
import com.speakwise.speakwise.dto.QuestionResponse;
import com.speakwise.speakwise.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final QuestionService questionService;

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDetailResponse>> getAllDetailed() {
        return ResponseEntity.ok(questionService.getAllDetailed());
    }

    @PostMapping("/questions")
    public ResponseEntity<QuestionResponse> addQuestion(@Valid @RequestBody AddQuestionRequest request) {
        return ResponseEntity.ok(questionService.addQuestion(request));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(@PathVariable Long id, @Valid @RequestBody AddQuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}