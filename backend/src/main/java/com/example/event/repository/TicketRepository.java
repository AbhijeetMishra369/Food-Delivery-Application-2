package com.example.event.repository;

import com.example.event.domain.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByCode(String code);
    long countByTicketTypeId(Long ticketTypeId);
}

