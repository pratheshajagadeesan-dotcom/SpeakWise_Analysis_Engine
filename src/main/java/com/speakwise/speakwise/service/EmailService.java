package com.speakwise.speakwise.service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendReportEmail(String toEmail, String questionText, double wpm, double relevanceScore) {
        String subject = "Your SpeakWise Report is Ready";
        String body = String.format(
                "Hi,%n%nYour practice session for question:%n\"%s\"%n%nWPM: %.1f%nRelevance Score: %.1f%%%n%nKeep practicing!%n- SpeakWise",
                questionText, wpm, relevanceScore);

        if (!mailEnabled) {
            log.info("[MOCK EMAIL to {}] subject='{}' body='{}'", toEmail, subject, body);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send report email", e);
        }
    }
}
