package com.speakwise.speakwise.repository;


import com.speakwise.speakwise.model.PracticeSession;
import com.speakwise.speakwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticeSessionRepository extends JpaRepository<PracticeSession, Long> {
    List<PracticeSession> findByUserOrderByCreatedAtDesc(User user);
}
