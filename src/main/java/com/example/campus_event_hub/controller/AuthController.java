package com.example.campus_event_hub.controller;

import com.example.campus_event_hub.dto.LoginRequest;
import com.example.campus_event_hub.dto.LoginResponse;
import com.example.campus_event_hub.entity.Admin;
import com.example.campus_event_hub.repository.AdminRepository;
import com.example.campus_event_hub.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AdminRepository adminRepository;
    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,AdminRepository adminRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        String token = jwtService.generateToken(request.getEmail());

        return new LoginResponse(
                token,
                admin.getName(),
                admin.getCollege().getCode(),
                admin.getCollege().getName()
        );
    }
}