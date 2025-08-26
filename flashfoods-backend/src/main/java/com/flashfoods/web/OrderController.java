package com.flashfoods.web;

import com.flashfoods.domain.entity.*;
import com.flashfoods.domain.repo.CartRepository;
import com.flashfoods.domain.repo.OrderRepository;
import com.flashfoods.domain.repo.RestaurantRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final CurrentUser currentUser;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;

    public OrderController(CurrentUser currentUser, CartRepository cartRepository, OrderRepository orderRepository, RestaurantRepository restaurantRepository) {
        this.currentUser = currentUser;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
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

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public List<Order> restaurantOrders(@PathVariable Long restaurantId) {
        // naive: no multi-restaurant cross-check; owners should only see their restaurant's orders
        Restaurant r = restaurantRepository.findById(restaurantId).orElseThrow();
        return orderRepository.findAll().stream().filter(o -> o.getRestaurant().getId().equals(r.getId())).toList();
    }

    @PostMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<?> updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        order.setStatus(status);
        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{orderId}/track")
    public ResponseEntity<?> track(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        // Mock tracking: convert order status into a delivery timeline
        return ResponseEntity.ok(new Object() {
            public final Long id = order.getId();
            public final String status = order.getStatus().name();
            public final String eta = switch (order.getStatus()) {
                case CREATED -> "40 mins";
                case PAID, PREPARING -> "30 mins";
                case DISPATCHED -> "15 mins";
                case DELIVERED -> "0 mins";
                case CANCELLED -> "-";
            };
        });
    }
}

