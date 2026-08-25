package com.alt.team2_api.user.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(

        @Email(message = "올바른 이메일 형식이어야 합니다.")
        String email,

        @Size(min = 8, max = 100, message = "비밀번호는 8자 이상 100자 이하여야 합니다.")
        String password
) {

    @AssertTrue(message = "이메일 또는 비밀번호 중 하나는 입력해야 합니다.")
    public boolean isValidRequest() {
        if (email != null && email.isBlank()) {
            return false;
        }

        if (password != null && password.isBlank()) {
            return false;
        }

        return email != null || password != null;
    }
}