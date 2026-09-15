package com.example.campus_event_hub.service;

import com.example.campus_event_hub.entity.Event;
import com.example.campus_event_hub.entity.Registration;
import com.example.campus_event_hub.exception.EventNotFoundException;
import com.example.campus_event_hub.exception.NoSeatsAvailableException;
import com.example.campus_event_hub.exception.RegistrationAlreadyExistsException;
import com.example.campus_event_hub.exception.RegistrationNotFoundException;
import com.example.campus_event_hub.repository.EventRepository;
import com.example.campus_event_hub.repository.RegistrationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    public RegistrationService(RegistrationRepository registrationRepository,
                               EventRepository eventRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
    }

    public Event getEvent(Long eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }

    public boolean isSeatAvailable(Event event) {
        return event.getAvailableSeats() > 0;
    }

    public boolean isAlreadyRegistered(String email, Long eventId) {
        return registrationRepository.existsByEmailAndEventId(email, eventId);
    }

    @Transactional
    public Registration registerStudent(Long eventId, Registration registration) {

        // 1. Event find karo
        Event event = eventRepository.findById(eventId).orElse(null);

        if (event == null) {
            throw new EventNotFoundException(
                    "Event not found with id: " + eventId);
        }

        // 2. Seat check
        if (event.getAvailableSeats() <= 0) {
            throw new NoSeatsAvailableException(
                    "No seats available for this event");
        }

        // 3. Duplicate registration check
        boolean alreadyRegistered =
                registrationRepository.existsByEmailAndEventId(
                        registration.getEmail(), eventId);

        if (alreadyRegistered) {
            throw new RegistrationAlreadyExistsException(
                    "Student already registered for this event");
        }

        // 4. Registration ko Event se connect karo
        registration.setEvent(event);

        // 5. Registration save karo
        Registration savedRegistration =
                registrationRepository.save(registration);

        // 6. Available seat 1 kam karo
        event.setAvailableSeats(event.getAvailableSeats() - 1);

        eventRepository.save(event);

        return savedRegistration;
    }


    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }
    public List<Registration> getRegistrationsByEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }


    @Transactional
    public void cancelRegistration(Long registrationId) {

        Registration registration =
                registrationRepository.findById(registrationId).orElse(null);

            if (registration == null) {
                throw new RegistrationNotFoundException(
                        "Registration not found with id: " + registrationId);
            }


        Event event = registration.getEvent();

        registrationRepository.deleteById(registrationId);

        event.setAvailableSeats(event.getAvailableSeats() + 1);

        eventRepository.save(event);
    }

    public List<Registration> getRegistrationsByEmail(String email) {
        return registrationRepository.findByEmail(email);
    }

}