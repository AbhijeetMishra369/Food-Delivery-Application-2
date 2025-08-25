package com.flashfoods.domain.repo;

import com.flashfoods.domain.entity.MenuItem;
import com.flashfoods.domain.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurant(Restaurant restaurant);
}

