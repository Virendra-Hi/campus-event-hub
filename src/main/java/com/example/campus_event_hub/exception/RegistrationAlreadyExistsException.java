package com.example.campus_event_hub.exception;

public class RegistrationAlreadyExistsException extends RuntimeException {

    public RegistrationAlreadyExistsException(String message) {
        super(message);
    }
}