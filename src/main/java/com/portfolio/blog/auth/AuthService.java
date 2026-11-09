package com.portfolio.blog.auth;

import com.portfolio.blog.admin.Admin;
import com.portfolio.blog.admin.AdminRepository;
import com.portfolio.blog.auth.dto.LoginRequest;
import com.portfolio.blog.auth.dto.LoginResponse;
import com.portfolio.blog.global.error.BusinessException;
import com.portfolio.blog.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request){
        Admin admin = adminRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new BusinessException(ErrorCode.LOGIN_FAILED));
        if(!passwordEncoder.matches(request.getPassword(), admin.getPassword())){
            throw new BusinessException(ErrorCode.LOGIN_FAILED);
        }
        return new LoginResponse(request.getLoginId());
    }
}
