package com.example.campus_event_hub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EventNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleEventNotFound(EventNotFoundException ex) {

        return ex.getMessage();
    }

    @ExceptionHandler(RegistrationAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleRegistrationAlreadyExists(
            RegistrationAlreadyExistsException ex) {

        return ex.getMessage();
    }

    @ExceptionHandler(NoSeatsAvailableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleNoSeatsAvailable(
            NoSeatsAvailableException ex) {

        return ex.getMessage();
    }

    @ExceptionHandler(RegistrationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleRegistrationNotFound(
            RegistrationNotFoundException ex) {

        return ex.getMessage();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleValidationException(
            MethodArgumentNotValidException ex) {

        return ex.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();
    }


    @ExceptionHandler(InvalidSeatCountException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleInvalidSeatCount(
            InvalidSeatCountException ex) {

        return ex.getMessage();
    }
}