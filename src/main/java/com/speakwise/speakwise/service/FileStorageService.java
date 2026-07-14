package com.speakwise.speakwise.service;

import com.speakwise.speakwise.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_EXTENSIONS = List.of("mp3", "wav", "m4a", "webm");
    private static final long MAX_SIZE_BYTES = 20L * 1024 * 1024;

    public File store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ApiException("Audio file is empty", 400);
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new ApiException("Audio file exceeds 20MB limit", 400);
        }

        String originalName = file.getOriginalFilename();
        String extension = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase()
                : "";

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ApiException("Only mp3, wav, or m4a files are allowed", 400);
        }

        try {
            Path dirPath = Paths.get(uploadDir);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String storedFilename = UUID.randomUUID() + "." + extension;
            Path filePath = dirPath.resolve(storedFilename);
            file.transferTo(filePath);

            return filePath.toFile();
        } catch (IOException e) {
            throw new ApiException("Failed to store audio file: " + e.getMessage(), 500);
        }
    }
}
