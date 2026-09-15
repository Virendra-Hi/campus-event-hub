package com.example.campus_event_hub.dto;

public class AdminResponse {

    private Long id;
    private String name;
    private String email;
    private String role;

    private String collegeCode;
    private String collegeName;

    public AdminResponse() {
    }

    public AdminResponse(Long id, String name, String email, String role,String collegeCode, String collegeName) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.collegeCode = collegeCode;
        this.collegeName = collegeName;
    }
    public String getCollegeCode() {
        return collegeCode;
    }

    public void setCollegeCode(String collegeCode) {
        this.collegeCode = collegeCode;
    }

    public String getCollegeName() {
        return collegeName;
    }

    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}