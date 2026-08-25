package com.alt.team2_api.auth.service;

import com.alt.team2_api.auth.dto.LoginRequest;
import com.alt.team2_api.auth.dto.SignupRequest;
import com.alt.team2_api.auth.dto.TokenResponse;
import com.alt.team2_api.global.exception.ApiException;
import com.alt.team2_api.global.exception.ErrorCode;
import com.alt.team2_api.user.entity.User;
import com.alt.team2_api.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class AuthServiceIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void clearUsers() {
        userRepository.deleteAll();
    }

    @Test
    void signupHashesPasswordAndLoginReturnsAccessToken() {
        String email = "auth-test@example.com";
        String rawPassword = "password123";

        authService.signup(new SignupRequest(email, rawPassword));

        User savedUser = userRepository.findByEmail(email).orElseThrow();
        assertNotEquals(rawPassword, savedUser.getPassword());
        assertTrue(passwordEncoder.matches(rawPassword, savedUser.getPassword()));

        TokenResponse response = authService.login(new LoginRequest(email, rawPassword));

        assertNotNull(response.accessToken());
        assertFalse(response.accessToken().isBlank());
    }

    @Test
    void loginWithWrongPasswordReturnsUnauthorized() {
        String email = "wrong-password-test@example.com";

        authService.signup(new SignupRequest(email, "password123"));

        ApiException exception = assertThrows(
                ApiException.class,
                () -> authService.login(new LoginRequest(email, "incorrect-password"))
        );

        assertEquals(ErrorCode.UNAUTHORIZED, exception.getErrorCode());
    }
}
