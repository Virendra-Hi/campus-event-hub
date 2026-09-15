package com.example.campus_event_hub.service;

import com.example.campus_event_hub.dto.AdminResponse;
import com.example.campus_event_hub.entity.Admin;
import com.example.campus_event_hub.entity.College;
import com.example.campus_event_hub.repository.AdminRepository;
import com.example.campus_event_hub.repository.CollegeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final CollegeRepository collegeRepository;

    public AdminService(AdminRepository adminRepository,
                        PasswordEncoder passwordEncoder,
                        CollegeRepository collegeRepository) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.collegeRepository = collegeRepository;
    }

    public AdminResponse signup(Admin admin) {

        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String collegeCode = admin.getCollegeCode();

        College college = collegeRepository.findByCode(collegeCode)
                .orElseThrow(() ->
                        new RuntimeException("College not found: " + collegeCode));

        admin.setCollege(college);

        admin.setCollege(college);

        admin.setPassword(
                passwordEncoder.encode(admin.getPassword())
        );

        admin.setRole("ADMIN");

        Admin savedAdmin = adminRepository.save(admin);

        return new AdminResponse(
                savedAdmin.getId(),
                savedAdmin.getName(),
                savedAdmin.getEmail(),
                savedAdmin.getRole(),
                savedAdmin.getCollege().getCode(),
                savedAdmin.getCollege().getName()
        );
    }
}