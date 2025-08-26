package com.flashfoods.web;

import com.flashfoods.domain.entity.Order;
import com.flashfoods.domain.entity.OrderStatus;
import com.flashfoods.domain.repo.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final OrderRepository orderRepository;

    @Value("${app.razorpay.keyId}")
    private String razorKeyId;
    @Value("${app.razorpay.keySecret}")
    private String razorKeySecret;

    public PaymentController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestParam Long orderId) throws Exception {
        com.flashfoods.domain.entity.Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        RazorpayClient client = new RazorpayClient(razorKeyId, razorKeySecret);
        JSONObject options = new JSONObject();
        options.put("amount", order.getTotalCents()); // in paise
        options.put("currency", "INR");
        options.put("receipt", "rcpt_" + order.getId());
        com.razorpay.Order rOrder = client.orders.create(options);
        return ResponseEntity.ok(Map.of(
                "orderId", rOrder.get("id"),
                "amount", rOrder.get("amount"),
                "currency", rOrder.get("currency"),
                "keyId", razorKeyId
        ));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam Long orderId,
                                    @RequestParam("razorpay_payment_id") String paymentId,
                                    @RequestParam("razorpay_order_id") String razorOrderId,
                                    @RequestParam("razorpay_signature") String signature) {
        com.flashfoods.domain.entity.Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        try {
            JSONObject json = new JSONObject();
            json.put("razorpay_payment_id", paymentId);
            json.put("razorpay_order_id", razorOrderId);
            json.put("razorpay_signature", signature);
            Utils.verifyPaymentSignature(json, razorKeySecret);
            order.setPaymentId(paymentId);
            order.setPaymentStatus("paid");
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
            return ResponseEntity.ok(Map.of("status", "success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Invalid signature"));
        }
    }
}

