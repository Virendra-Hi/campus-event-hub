package com.example.campus_event_hub.controller;

import com.example.campus_event_hub.entity.Registration;
import com.example.campus_event_hub.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/{eventId}/register")
    public Registration registerStudent(
            @PathVariable Long eventId,
            @Valid @RequestBody Registration registration) {

        return registrationService.registerStudent(eventId, registration);
    }

    @GetMapping("/registrations")
    public List<Registration> getAllRegistrations() {
        return registrationService.getAllRegistrations();
    }
    @GetMapping("/{eventId}/registrations")
    public List<Registration> getRegistrationsByEvent(
            @PathVariable Long eventId) {

        return registrationService.getRegistrationsByEvent(eventId);
    }

    @DeleteMapping("/registration/{registrationId}")
    public String cancelRegistration(
            @PathVariable Long registrationId) {

        registrationService.cancelRegistration(registrationId);

        return "Registration cancelled successfully";
    }

    @DeleteMapping("/registration/student/{registrationId}")
    public String cancelRegistrationByStudent(
            @PathVariable Long registrationId) {

        registrationService.cancelRegistration(registrationId);

        return "Registration cancelled successfully";
    }

    @GetMapping("/registrations/by-email")
    public List<Registration> getRegistrationsByEmail(
            @RequestParam String email) {

        return registrationService.getRegistrationsByEmail(email);
    }
}