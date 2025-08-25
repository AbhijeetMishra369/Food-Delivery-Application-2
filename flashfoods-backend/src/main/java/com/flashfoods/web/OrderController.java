package com.flashfoods.web;

import com.flashfoods.domain.entity.*;
import com.flashfoods.domain.repo.CartRepository;
import com.flashfoods.domain.repo.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final CurrentUser currentUser;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    public OrderController(CurrentUser currentUser, CartRepository cartRepository, OrderRepository orderRepository) {
        this.currentUser = currentUser;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create() {
        User user = currentUser.get();
        Cart cart = cartRepository.findByUser(user).orElse(null);
        if (cart == null || cart.getItems().isEmpty()) return ResponseEntity.badRequest().body("Cart is empty");

        Order order = new Order();
        order.setUser(user);
        // naive: assume all items from one restaurant (first)
        Restaurant restaurant = cart.getItems().get(0).getMenuItem().getRestaurant();
        order.setRestaurant(restaurant);
        order.setSubtotalCents(cart.getSubtotalCents());
        order.setDiscountCents(cart.getDiscountCents());
        order.setTotalCents(cart.getTotalCents());
        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setMenuItem(ci.getMenuItem());
            oi.setQuantity(ci.getQuantity());
            oi.setLineTotalCents(ci.getLineTotalCents());
            order.getItems().add(oi);
        }
        order.setPaymentStatus("created");
        order.setStatus(OrderStatus.CREATED);
        orderRepository.save(order);

        // Razorpay stub: return order id and amount to client to proceed payment
        return ResponseEntity.ok(new Object() { public final Long orderId = order.getId(); public final Integer amount = order.getTotalCents(); });
    }

    @PostMapping("/{orderId}/mark-paid")
    public ResponseEntity<?> markPaid(@PathVariable Long orderId, @RequestParam String paymentId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        order.setPaymentId(paymentId);
        order.setPaymentStatus("paid");
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public List<Order> myOrders() {
        return orderRepository.findByUserOrderByCreatedAtDesc(currentUser.get());
    }
}

