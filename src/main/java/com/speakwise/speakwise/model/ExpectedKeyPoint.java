package com.speakwise.speakwise.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "expected_key_points")
@Getter
@Setter
@NoArgsConstructor
public class ExpectedKeyPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String keyword;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    public ExpectedKeyPoint(String keyword, Question question) {
        this.keyword = keyword;
        this.question = question;
    }
}
