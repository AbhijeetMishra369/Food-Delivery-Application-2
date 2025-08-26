package com.flashfoods.web;

import com.flashfoods.domain.entity.Order;
import com.flashfoods.domain.repo.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final OrderRepository orderRepository;

    public PaymentController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestParam Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        String paymentSession = UUID.randomUUID().toString();
        return ResponseEntity.ok(Map.of("paymentSession", paymentSession, "amount", order.getTotalCents()));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam Long orderId, @RequestParam String paymentSession) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        // Mock: accept any session
        order.setPaymentStatus("paid");
        order.setStatus(com.flashfoods.domain.entity.OrderStatus.PAID);
        order.setPaymentId(paymentSession);
        orderRepository.save(order);
        return ResponseEntity.ok(Map.of("status", "success"));
    }
}

