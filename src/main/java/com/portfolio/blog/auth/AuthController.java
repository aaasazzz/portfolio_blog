package com.portfolio.blog.auth;

import com.portfolio.blog.auth.dto.LoginRequest;
import com.portfolio.blog.auth.dto.LoginResponse;
import com.portfolio.blog.global.error.BusinessException;
import com.portfolio.blog.global.error.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest httpRequest){
        HttpSession session = httpRequest.getSession(false);
        if(session == null){
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        session.invalidate();
    }

    @GetMapping("/me")
    public LoginResponse me(@SessionAttribute(name = "loginId", required = false) String loginId){
        if(loginId == null){
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        return new LoginResponse(loginId);
    }
}
