package com.flashfoods.domain.repo;

import com.flashfoods.domain.entity.Restaurant;
import com.flashfoods.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByOwner(User owner);
}

