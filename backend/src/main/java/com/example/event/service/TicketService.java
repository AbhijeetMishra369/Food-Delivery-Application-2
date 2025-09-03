package com.example.event.service;

import com.example.event.domain.*;
import com.example.event.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;

    @Transactional
    public Ticket purchaseTicket(User purchaser, Event event, Long ticketTypeId) {
        TicketType type = ticketTypeRepository.findById(ticketTypeId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket type not found"));
        if (!type.getEvent().getId().equals(event.getId())) {
            throw new IllegalArgumentException("Type not for this event");
        }
        if (type.getSoldCount() >= type.getTotalAvailable()) {
            throw new IllegalStateException("Tickets sold out");
        }
        type.setSoldCount(type.getSoldCount() + 1);
        ticketTypeRepository.save(type);

        Ticket ticket = Ticket.builder()
                .event(event)
                .ticketType(type)
                .purchaser(purchaser)
                .code(UUID.randomUUID().toString())
                .purchasedAt(LocalDateTime.now())
                .checkedIn(false)
                .build();
        return ticketRepository.save(ticket);
    }

    public Optional<Ticket> validate(String code) {
        return ticketRepository.findByCode(code);
    }

    @Transactional
    public Ticket checkIn(String code) {
        Ticket ticket = ticketRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
        if (ticket.isCheckedIn()) {
            throw new IllegalStateException("Duplicate entry detected");
        }
        ticket.setCheckedIn(true);
        ticket.setCheckedInAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
}

