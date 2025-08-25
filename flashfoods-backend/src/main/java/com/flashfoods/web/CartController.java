package com.flashfoods.web;

import com.flashfoods.domain.entity.*;
import com.flashfoods.domain.repo.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartRepository cartRepository;
    private final MenuItemRepository menuItemRepository;
    private final CouponRepository couponRepository;
    private final CurrentUser currentUser;

    public CartController(CartRepository cartRepository, MenuItemRepository menuItemRepository, CouponRepository couponRepository, CurrentUser currentUser) {
        this.cartRepository = cartRepository;
        this.menuItemRepository = menuItemRepository;
        this.couponRepository = couponRepository;
        this.currentUser = currentUser;
    }

    private Cart findOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            return cartRepository.save(c);
        });
    }

    private void recomputeTotals(Cart cart) {
        int subtotal = cart.getItems().stream().mapToInt(CartItem::getLineTotalCents).sum();
        int discount = 0;
        if (cart.getAppliedCoupon() != null && cart.getAppliedCoupon().getPercentOff() != null) {
            discount = subtotal * cart.getAppliedCoupon().getPercentOff() / 100;
            if (cart.getAppliedCoupon().getMaxOffCents() != null) {
                discount = Math.min(discount, cart.getAppliedCoupon().getMaxOffCents());
            }
        }
        cart.setSubtotalCents(subtotal);
        cart.setDiscountCents(discount);
        cart.setTotalCents(Math.max(0, subtotal - discount));
    }

    @GetMapping
    public Cart getCart() {
        User user = currentUser.get();
        return findOrCreateCart(user);
    }

    @PostMapping("/add/{menuItemId}")
    public Cart addItem(@PathVariable Long menuItemId, @RequestParam(defaultValue = "1") int qty) {
        User user = currentUser.get();
        Cart cart = findOrCreateCart(user);
        MenuItem item = menuItemRepository.findById(menuItemId).orElseThrow();
        CartItem ci = new CartItem();
        ci.setCart(cart);
        ci.setMenuItem(item);
        ci.setQuantity(qty);
        ci.setLineTotalCents(item.getPriceCents() * qty);
        cart.getItems().add(ci);
        recomputeTotals(cart);
        return cartRepository.save(cart);
    }

    @PostMapping("/apply-coupon/{code}")
    public ResponseEntity<?> applyCoupon(@PathVariable String code) {
        User user = currentUser.get();
        Cart cart = findOrCreateCart(user);
        Coupon coupon = couponRepository.findByCodeAndActiveTrue(code).orElse(null);
        if (coupon == null) return ResponseEntity.badRequest().body(Map.of("message", "Invalid coupon"));
        cart.setAppliedCoupon(coupon);
        recomputeTotals(cart);
        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/clear")
    public Cart clear() {
        User user = currentUser.get();
        Cart cart = findOrCreateCart(user);
        cart.getItems().clear();
        cart.setAppliedCoupon(null);
        recomputeTotals(cart);
        return cartRepository.save(cart);
    }
}

