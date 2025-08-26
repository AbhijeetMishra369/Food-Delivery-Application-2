package com.flashfoods.domain.repo;

import com.flashfoods.domain.entity.MenuItem;
import com.flashfoods.domain.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurant(Restaurant restaurant);

    @Query("select m from MenuItem m where m.available = true order by m.priceCents asc")
    List<MenuItem> findPopularLimited(org.springframework.data.domain.Pageable pageable);
}

