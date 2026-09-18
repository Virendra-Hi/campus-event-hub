package com.example.campus_event_hub.service;

import com.example.campus_event_hub.entity.Admin;
import com.example.campus_event_hub.entity.College;
import com.example.campus_event_hub.entity.Event;
import com.example.campus_event_hub.exception.EventNotFoundException;
import com.example.campus_event_hub.exception.InvalidSeatCountException;
import com.example.campus_event_hub.repository.AdminRepository;
import com.example.campus_event_hub.repository.CollegeRepository;
import com.example.campus_event_hub.repository.EventRepository;
import com.example.campus_event_hub.repository.RegistrationRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    private final AdminRepository adminRepository;

    private final RegistrationRepository registrationRepository;
    private final CollegeRepository collegeRepository;
    public EventService(EventRepository eventRepository,
                        RegistrationRepository registrationRepository,
                        CollegeRepository collegeRepository,AdminRepository adminRepository) {

        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.collegeRepository = collegeRepository;
        this.adminRepository = adminRepository;
    }


    private Admin getCurrentAdmin() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return adminRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));
    }


    public Event createEvent(Event event) {
        event.setAvailableSeats(event.getTotalSeats());

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        event.setCollege(admin.getCollege());

        return eventRepository.save(event);
    }

    public List<Event> getAllEvents(String college) {

        // College select nahi kiya → saare events
        if (college == null || college.isBlank()) {
            return eventRepository.findAll();
        }

        // College code ke according events
        return eventRepository.findByCollegeCode(college);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new EventNotFoundException("Event not found with id: " + id));
    }


    public Event updateEvent(Long id, Event event) {

        Admin admin = getCurrentAdmin();

        Event existingEvent = eventRepository
                .findByIdAndCollegeId(
                        id,
                        admin.getCollege().getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "You are not authorized to update this event"
                        ));

        
        long registeredStudents =
                registrationRepository.countByEventId(id);

        if (event.getTotalSeats() < registeredStudents) {
            throw new InvalidSeatCountException(
                    "Total seats cannot be less than registered students");
        }

        existingEvent.setTitle(event.getTitle());
        existingEvent.setEventDate(event.getEventDate());
        existingEvent.setVenue(event.getVenue());
        existingEvent.setTotalSeats(event.getTotalSeats());

        existingEvent.setAvailableSeats(
                event.getTotalSeats() - (int) registeredStudents
        );

        return eventRepository.save(existingEvent);
    }

    @Transactional
    public void deleteEvent(Long id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() ->
                        new EventNotFoundException(
                                "Event not found with id: " + id));

        Admin admin = getCurrentAdmin();

        if (!event.getCollege().getId()
                .equals(admin.getCollege().getId())) {

            throw new RuntimeException(
                    "You are not authorized to delete this event");
        }
        registrationRepository.deleteByEventId(id);

        eventRepository.delete(event);
    }
}