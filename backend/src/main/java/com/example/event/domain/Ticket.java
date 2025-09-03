package com.example.event.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Event event;

    @ManyToOne(optional = false)
    private TicketType ticketType;

    @ManyToOne(optional = false)
    private User purchaser;

    @Column(nullable = false, unique = true)
    private String code; // used in QR

    @Column(nullable = false)
    private LocalDateTime purchasedAt;

    @Column(nullable = false)
    private boolean checkedIn = false;

    private LocalDateTime checkedInAt;
}

