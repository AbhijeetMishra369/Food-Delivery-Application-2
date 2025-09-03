package com.example.event.web;

import com.example.event.domain.Event;
import com.example.event.domain.Ticket;
import com.example.event.domain.User;
import com.example.event.repository.EventRepository;
import com.example.event.repository.UserRepository;
import com.example.event.service.TicketService;
import com.example.event.web.dto.Dtos;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @PostMapping("/purchase")
    public ResponseEntity<Ticket> purchase(@Validated @RequestBody Dtos.PurchaseRequest req) {
        Event event = eventRepository.findById(req.eventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        User purchaser = userRepository.findByEmail("attendee@example.com")
                .orElseGet(() -> userRepository.save(User.builder().email("attendee@example.com").passwordHash("noop").build()));
        Ticket ticket = ticketService.purchaseTicket(purchaser, event, req.ticketTypeId());
        return ResponseEntity.created(URI.create("/api/tickets/" + ticket.getId())).body(ticket);
    }

    @PostMapping("/validate")
    public ResponseEntity<Dtos.ValidateTicketResponse> validate(@Validated @RequestBody Dtos.ValidateTicketRequest req) {
        return ticketService.validate(req.code())
                .map(t -> ResponseEntity.ok(new Dtos.ValidateTicketResponse(!t.isCheckedIn(), t.getId())))
                .orElse(ResponseEntity.badRequest().body(new Dtos.ValidateTicketResponse(false, null)));
    }

    @PostMapping("/checkin")
    public ResponseEntity<Ticket> checkin(@Validated @RequestBody Dtos.ValidateTicketRequest req) {
        return ResponseEntity.ok(ticketService.checkIn(req.code()));
    }
}

