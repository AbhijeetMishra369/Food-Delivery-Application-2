package com.flashfoods.domain.repo;

import com.flashfoods.domain.entity.Cart;
import com.flashfoods.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}

