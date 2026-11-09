package com.portfolio.blog.auth;

import com.portfolio.blog.auth.dto.LoginRequest;
import com.portfolio.blog.auth.dto.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest){
        LoginResponse loginResponse = authService.login(request);
        HttpSession session = httpRequest.getSession();
        httpRequest.changeSessionId();
        session.setAttribute("loginId", loginResponse.getLoginId());
        return loginResponse;

    }
}
