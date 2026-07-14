package com.speakwise.speakwise.seed;



import com.speakwise.speakwise.model.ExpectedKeyPoint;
import com.speakwise.speakwise.model.FillerWord;
import com.speakwise.speakwise.model.Question;
import com.speakwise.speakwise.model.Role;
import com.speakwise.speakwise.model.User;
import com.speakwise.speakwise.repository.FillerWordRepository;
import com.speakwise.speakwise.repository.QuestionRepository;
import com.speakwise.speakwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final QuestionRepository questionRepository;
    private final FillerWordRepository fillerWordRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedFillerWords();
        seedQuestions();
        seedAdmin();
    }

    private void seedFillerWords() {
        if (fillerWordRepository.count() > 0) return;
        List.of("um", "like", "actually", "basically", "you know")
                .forEach(w -> fillerWordRepository.save(new FillerWord(w)));
    }

    private void seedQuestions() {
        if (questionRepository.count() > 0) return;

        addQuestion("Tell me about yourself.", "Behavioral",
                List.of("experience", "skills", "projects", "goals"));

        addQuestion("Why do you want to work at this company?", "Behavioral",
                List.of("research", "culture", "growth", "mission"));

        addQuestion("Explain the difference between REST and GraphQL.", "Technical",
                List.of("endpoints", "over-fetching", "schema", "flexibility"));

        addQuestion("Describe a challenging bug you fixed.", "Technical",
                List.of("problem", "debugging", "root cause", "solution"));

        addQuestion("How do you handle conflicting priorities in a team?", "Behavioral",
                List.of("communication", "prioritize", "deadline", "collaborate"));
    }

    private void addQuestion(String text, String category, List<String> keyPoints) {
        Question question = new Question(text, category);
        keyPoints.forEach(kp -> question.getExpectedKeyPoints().add(new ExpectedKeyPoint(kp, question)));
        questionRepository.save(question);
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail("admin@speakwise.com")) return;
        User admin = new User("Admin", "admin@speakwise.com", passwordEncoder.encode("admin123"), Role.ADMIN);
        userRepository.save(admin);
    }
}
