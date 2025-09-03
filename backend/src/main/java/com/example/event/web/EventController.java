package com.example.event.web;

import com.example.event.domain.*;
import com.example.event.repository.EventRepository;
import com.example.event.repository.UserRepository;
import com.example.event.service.EventService;
import com.example.event.web.dto.Dtos;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Event> list(@RequestParam(value = "q", required = false) String q) {
        return eventService.search(q);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> get(@PathVariable Long id) {
        return eventRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Event> create(@Validated @RequestBody Dtos.CreateEventRequest req) {
        // For demo, associate with first organizer user if present, else create one
        User organizer = userRepository.findByEmail("organizer@example.com")
                .orElseGet(() -> userRepository.save(User.builder().email("organizer@example.com").passwordHash("noop").build()));

        Event event = Event.builder()
                .name(req.name())
                .description(req.description())
                .date(req.date())
                .time(req.time())
                .venue(req.venue())
                .build();

        List<TicketType> types = req.ticketTypes() == null ? List.of() : req.ticketTypes().stream().map(t ->
                TicketType.builder().name(t.name()).price(t.price()).totalAvailable(t.totalAvailable()).build()
        ).collect(Collectors.toList());
        Event saved = eventService.createEvent(event, types, organizer);
        return ResponseEntity.created(URI.create("/api/events/" + saved.getId())).body(saved);
    }

    @GetMapping("/{id}/ticket-types")
    public List<TicketType> types(@PathVariable Long id) {
        return eventService.getTicketTypes(id);
    }
}

