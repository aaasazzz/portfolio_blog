package com.portfolio.blog.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;

    @Override
    public void run(String... args) {
        if (adminRepository.count() == 0) {
            adminRepository.save(new Admin("admin", "admin1234"));
        }
    }
}
