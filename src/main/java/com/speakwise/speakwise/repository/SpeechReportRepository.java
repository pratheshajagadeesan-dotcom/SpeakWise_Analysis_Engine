package com.speakwise.speakwise.repository;



import com.speakwise.speakwise.model.SpeechReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpeechReportRepository extends JpaRepository<SpeechReport, Long> {
    Optional<SpeechReport> findBySessionId(Long sessionId);
}
