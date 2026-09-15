package com.example.campus_event_hub.config;

import com.example.campus_event_hub.entity.Admin;
import com.example.campus_event_hub.repository.AdminRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminUserConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(
            AdminRepository adminRepository) {

        return username -> {

            Admin admin = adminRepository.findByEmail(username)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Admin not found with email: " + username
                            )
                    );

            return User.builder()
                    .username(admin.getEmail())
                    .password(admin.getPassword())
                    .roles(admin.getRole())
                    .build();
        };
    }
}