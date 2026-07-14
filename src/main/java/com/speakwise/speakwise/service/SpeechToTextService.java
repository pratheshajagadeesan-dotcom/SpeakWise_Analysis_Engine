package com.speakwise.speakwise.service;



import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class SpeechToTextService {

    @Value("${app.assemblyai.api-key:}")
    private String apiKey;

    @Value("${app.assemblyai.base-url:https://api.assemblyai.com/v2}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TranscriptResult transcribe(File audioFile) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("No AssemblyAI API key set — using MOCK transcript.");
            return mockTranscribe();
        }
        return realTranscribe(audioFile);
    }

    private TranscriptResult mockTranscribe() {
        String sample = "So um my name is Priya and I have basically three years of experience in "
                + "backend development like Java and Spring Boot you know I have worked on REST APIs "
                + "and databases and I actually enjoy solving performance problems";

        String[] words = sample.split("\\s+");
        List<TranscriptResult.WordTiming> timings = new ArrayList<>();
        double t = 0.0;
        for (int i = 0; i < words.length; i++) {
            double wordDuration = 0.35;
            if (i == words.length / 2) {
                t += 2.5;
            }
            timings.add(new TranscriptResult.WordTiming(words[i], t, t + wordDuration));
            t += wordDuration;
        }
        return new TranscriptResult(sample, timings, t);
    }

    private TranscriptResult realTranscribe(File audioFile) {
        try {
            HttpHeaders uploadHeaders = new HttpHeaders();
            uploadHeaders.set("authorization", apiKey);
            uploadHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(audioFile));

            HttpEntity<byte[]> uploadEntity = new HttpEntity<>(java.nio.file.Files.readAllBytes(audioFile.toPath()), uploadHeaders);
            ResponseEntity<String> uploadResponse = restTemplate.postForEntity(baseUrl + "/upload", uploadEntity, String.class);
            String audioUrl = objectMapper.readTree(uploadResponse.getBody()).get("upload_url").asText();

            HttpHeaders jsonHeaders = new HttpHeaders();
            jsonHeaders.set("authorization", apiKey);
            jsonHeaders.setContentType(MediaType.APPLICATION_JSON);

            String requestJson = objectMapper.writeValueAsString(
                    java.util.Map.of("audio_url", audioUrl, "language_code", "en")
            );
            HttpEntity<String> transcriptRequest = new HttpEntity<>(requestJson, jsonHeaders);
            ResponseEntity<String> transcriptResponse = restTemplate.postForEntity(baseUrl + "/transcript", transcriptRequest, String.class);
            String transcriptId = objectMapper.readTree(transcriptResponse.getBody()).get("id").asText();

            JsonNode result;
            HttpEntity<Void> pollEntity = new HttpEntity<>(jsonHeaders);
            while (true) {
                ResponseEntity<String> pollResponse = restTemplate.exchange(
                        baseUrl + "/transcript/" + transcriptId, HttpMethod.GET, pollEntity, String.class);
                result = objectMapper.readTree(pollResponse.getBody());
                String status = result.get("status").asText();
                if (status.equals("completed")) break;
                if (status.equals("error")) throw new RuntimeException("AssemblyAI error: " + result.get("error").asText());
                Thread.sleep(3000);
            }

            String text = result.get("text").asText();
            List<TranscriptResult.WordTiming> timings = new ArrayList<>();
            double maxEnd = 0;
            for (JsonNode w : result.get("words")) {
                double start = w.get("start").asDouble() / 1000.0;
                double end = w.get("end").asDouble() / 1000.0;
                timings.add(new TranscriptResult.WordTiming(w.get("text").asText(), start, end));
                maxEnd = Math.max(maxEnd, end);
            }
            return new TranscriptResult(text, timings, maxEnd);

        } catch (Exception e) {
            log.error("AssemblyAI transcription failed, falling back to mock", e);
            return mockTranscribe();
        }
    }
}
