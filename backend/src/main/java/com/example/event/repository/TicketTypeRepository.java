package com.example.event.repository;

import com.example.event.domain.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    List<TicketType> findByEventId(Long eventId);
}

