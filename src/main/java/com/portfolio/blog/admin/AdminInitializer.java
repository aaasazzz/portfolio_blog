package com.portfolio.blog.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void run(String... args) {
        if (adminRepository.count() == 0) {
            adminRepository.save(new Admin("admin", passwordEncoder.encode("admin1234")));
        }
    }
}
