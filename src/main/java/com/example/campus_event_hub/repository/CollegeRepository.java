package com.example.campus_event_hub.repository;

import com.example.campus_event_hub.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CollegeRepository extends JpaRepository<College, Long> {

    Optional<College> findByCode(String code);

    boolean existsByCode(String code);
}