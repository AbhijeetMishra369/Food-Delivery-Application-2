package com.flashfoods.domain.repo;

import com.flashfoods.domain.entity.Restaurant;
import com.flashfoods.domain.entity.Review;
import com.flashfoods.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRestaurant(Restaurant restaurant);
    List<Review> findByUser(User user);
}

