package com.example.campus_event_hub.repository;

import com.example.campus_event_hub.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCollegeId(Long collegeId);
    List<Event> findByCollegeCode(String code);
    Optional<Event> findByIdAndCollegeId(Long id, Long collegeId);
}