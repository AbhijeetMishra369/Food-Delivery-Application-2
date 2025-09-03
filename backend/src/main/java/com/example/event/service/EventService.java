package com.example.event.service;

import com.example.event.domain.*;
import com.example.event.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;

    public List<Event> search(String q) {
        if (q == null || q.isBlank()) return eventRepository.findAll();
        return eventRepository.findByNameContainingIgnoreCase(q.trim());
    }

    @Transactional
    public Event createEvent(Event event, List<TicketType> types, User organizer) {
        event.setOrganizer(organizer);
        Event saved = eventRepository.save(event);
        for (TicketType type : types) {
            type.setEvent(saved);
            ticketTypeRepository.save(type);
        }
        return saved;
    }

    public List<TicketType> getTicketTypes(Long eventId) {
        return ticketTypeRepository.findByEventId(eventId);
    }
}

