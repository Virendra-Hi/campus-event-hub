package com.example.campus_event_hub.controller;

import com.example.campus_event_hub.entity.College;
import com.example.campus_event_hub.repository.CollegeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {

    private final CollegeRepository collegeRepository;

    public CollegeController(CollegeRepository collegeRepository) {
        this.collegeRepository = collegeRepository;
    }

    @GetMapping
    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }
}