package com.speakwise.speakwise.service;

import com.speakwise.speakwise.dto.AddQuestionRequest;
import com.speakwise.speakwise.dto.QuestionDetailResponse;
import com.speakwise.speakwise.dto.QuestionResponse;
import com.speakwise.speakwise.exception.ApiException;
import com.speakwise.speakwise.model.ExpectedKeyPoint;
import com.speakwise.speakwise.model.Question;
import com.speakwise.speakwise.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public List<QuestionResponse> getAll() {
        return questionRepository.findAll().stream()
                .map(q -> new QuestionResponse(q.getId(), q.getText(), q.getCategory()))
                .toList();
    }

    public List<QuestionDetailResponse> getAllDetailed() {
        return questionRepository.findAll().stream()
                .map(q -> new QuestionDetailResponse(
                        q.getId(),
                        q.getText(),
                        q.getCategory(),
                        q.getExpectedKeyPoints().stream().map(ExpectedKeyPoint::getKeyword).toList()
                ))
                .toList();
    }

    public QuestionResponse addQuestion(AddQuestionRequest request) {
        Question question = new Question(request.getText(), request.getCategory());
        for (String keyword : request.getExpectedKeyPoints()) {
            question.getExpectedKeyPoints().add(new ExpectedKeyPoint(keyword, question));
        }
        questionRepository.save(question);
        return new QuestionResponse(question.getId(), question.getText(), question.getCategory());
    }

    public QuestionResponse updateQuestion(Long id, AddQuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ApiException("Question not found", 404));

        question.setText(request.getText());
        question.setCategory(request.getCategory());
        question.getExpectedKeyPoints().clear();
        for (String keyword : request.getExpectedKeyPoints()) {
            question.getExpectedKeyPoints().add(new ExpectedKeyPoint(keyword, question));
        }
        questionRepository.save(question);
        return new QuestionResponse(question.getId(), question.getText(), question.getCategory());
    }

    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ApiException("Question not found", 404);
        }
        questionRepository.deleteById(id);
    }
}