package com.flashfoods.domain.repo;

import com.flashfoods.domain.entity.Order;
import com.flashfoods.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}

