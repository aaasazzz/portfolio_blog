package com.portfolio.blog.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginRequest {
    @NotBlank
    @Size(max = 100)
    private String loginId;

    @NotBlank
    @Size(max = 100)
    private String password;
}
