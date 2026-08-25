package com.alt.team2_api.user.controller;

import com.alt.team2_api.auth.jwt.JwtTokenProvider;
import com.alt.team2_api.user.entity.User;
import com.alt.team2_api.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void clearUsers() {
        userRepository.deleteAll();
    }

    @Test
    void getMeReturnsAuthenticatedUser() throws Exception {
        User user = saveUser("me@example.com", "password123");
        String token = jwtTokenProvider.createAccessToken(user.getId());

        mockMvc.perform(get("/api/users/me")
                        .header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(user.getId()))
                .andExpect(jsonPath("$.email").value("me@example.com"));
    }

    @Test
    void updateMeChangesEmailAndHashesPassword() throws Exception {
        User user = saveUser("before@example.com", "password123");
        String token = jwtTokenProvider.createAccessToken(user.getId());

        mockMvc.perform(put("/api/users/me")
                        .header(HttpHeaders.AUTHORIZATION, bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "after@example.com",
                                  "password": "newPassword123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(user.getId()))
                .andExpect(jsonPath("$.email").value("after@example.com"));

        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertTrue(passwordEncoder.matches("newPassword123", updatedUser.getPassword()));
        assertFalse(passwordEncoder.matches("password123", updatedUser.getPassword()));
    }

    @Test
    void deleteMeDeletesAuthenticatedUser() throws Exception {
        User user = saveUser("delete@example.com", "password123");
        String token = jwtTokenProvider.createAccessToken(user.getId());

        mockMvc.perform(delete("/api/users/me")
                        .header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isNoContent());

        assertFalse(userRepository.existsById(user.getId()));
    }

    @Test
    void getMeWithoutTokenReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    private User saveUser(String email, String password) {
        return userRepository.save(new User(
                email,
                passwordEncoder.encode(password)
        ));
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}
