package com.example.campus_event_hub.repository;

import com.example.campus_event_hub.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationRepository
        extends JpaRepository<Registration, Long> {

    boolean existsByEmailAndEventId(String email, Long eventId);

    List<Registration> findByEventId(Long eventId);
    List<Registration> findByEmail(String email);

    long countByEventId(Long eventId);
    void deleteByEventId(Long eventId);

}