package com.speakwise.speakwise.service;

import com.speakwise.speakwise.dto.ChangePasswordRequest;
import com.speakwise.speakwise.dto.UpdateProfileRequest;
import com.speakwise.speakwise.dto.UserProfileResponse;
import com.speakwise.speakwise.exception.ApiException;
import com.speakwise.speakwise.model.User;
import com.speakwise.speakwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getProfile(String email) {
        User user = findUser(email);
        return toResponse(user);
    }

    public UserProfileResponse updateProfile(String currentEmail, UpdateProfileRequest request) {
        User user = findUser(currentEmail);

        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("That email is already in use", 409);
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        userRepository.save(user);
        return toResponse(user);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = findUser(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ApiException("Current password is incorrect", 400);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
    }

    private UserProfileResponse toResponse(User user) {
        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}