package com.example.campus_event_hub.exception;

public class InvalidSeatCountException extends RuntimeException {

    public InvalidSeatCountException(String message) {
        super(message);
    }
}