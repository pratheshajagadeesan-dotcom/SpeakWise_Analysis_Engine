package com.speakwise.speakwise.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "speech_reports")
@Getter
@Setter
@NoArgsConstructor
public class SpeechReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private PracticeSession session;

    private double wpm;
    private int pauseCount;
    private int fillerCount;
    private double relevanceScore;

    @Column(length = 1000)
    private String missingKeyPoints;

    @Column(length = 500)
    private String tipMessage;
}
