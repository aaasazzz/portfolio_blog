package com.portfolio.blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PortfolioBlogApplication {
	public static void main(String[] args) {
		SpringApplication.run(PortfolioBlogApplication.class, args);
	}

}
