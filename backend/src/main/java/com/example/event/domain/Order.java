package com.example.event.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User purchaser;

    @ManyToOne(optional = false)
    private Event event;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String status; // CREATED, PAID, FAILED

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String paymentProvider; // razorpay
    private String paymentReference; // order id / payment id
}

