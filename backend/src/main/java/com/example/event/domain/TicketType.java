package com.example.event.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "ticket_types")
public class TicketType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Event event;

    @Column(nullable = false)
    private String name; // VIP, GA, Early Bird

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer totalAvailable;

    @Column(nullable = false)
    private Integer soldCount = 0;
}

