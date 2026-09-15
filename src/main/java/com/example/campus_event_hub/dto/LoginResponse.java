package com.example.campus_event_hub.dto;

public class LoginResponse {

    private String token;
    private String name;
    private String collegeCode;
    private String collegeName;

    public LoginResponse() {
    }

    public LoginResponse(String token, String name,
                         String collegeCode, String collegeName) {
        this.token = token;
        this.name = name;
        this.collegeCode = collegeCode;
        this.collegeName = collegeName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
}