package com.portfolio.blog.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    @Value("${admin.login-id}")
    private String loginId;

    @Value("${admin.password}")
    private String password;

    @Override
    public void run(String... args) {
        if (adminRepository.count() == 0) {
            adminRepository.save(new Admin(loginId, passwordEncoder.encode(password)));
        }
    }
}
