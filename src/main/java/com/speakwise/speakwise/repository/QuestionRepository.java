package com.speakwise.speakwise.repository;

import com.speakwise.speakwise.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
