package com.alt.team2_api.user.service;

import com.alt.team2_api.global.exception.ApiException;
import com.alt.team2_api.global.exception.ErrorCode;
import com.alt.team2_api.user.dto.UpdateUserRequest;
import com.alt.team2_api.user.dto.UserResponse;
import com.alt.team2_api.user.entity.User;
import com.alt.team2_api.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserResponse getMe(Long userId) {
        User user = getUser(userId);

        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateMe(Long userId, UpdateUserRequest request) {
        User user = getUser(userId);

        if (request.email() != null) {
            String email = normalizeEmail(request.email());

            if (userRepository.existsByEmailAndIdNot(email, userId)) {
                throw new ApiException(ErrorCode.DUPLICATE_EMAIL);
            }

            user.updateEmail(email);
        }

        if (request.password() != null) {
            user.updatePassword(passwordEncoder.encode(request.password()));
        }

        return UserResponse.from(user);
    }

    @Transactional
    public void deleteMe(Long userId) {
        User user = getUser(userId);

        userRepository.delete(user);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
