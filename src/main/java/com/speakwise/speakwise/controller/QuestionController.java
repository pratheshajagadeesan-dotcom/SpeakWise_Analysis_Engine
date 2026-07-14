package com.speakwise.speakwise.controller;



import com.speakwise.speakwise.dto.QuestionResponse;
import com.speakwise.speakwise.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getAll() {
        return ResponseEntity.ok(questionService.getAll());
    }
}