package com.example.campus_event_hub.controller;

import com.example.campus_event_hub.dto.AdminResponse;
import com.example.campus_event_hub.entity.Admin;
import com.example.campus_event_hub.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminResponse signup(@Valid @RequestBody Admin admin) {
        return adminService.signup(admin);
    }
}