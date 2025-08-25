package com.flashfoods.web;

import com.flashfoods.domain.entity.Restaurant;
import com.flashfoods.domain.entity.Review;
import com.flashfoods.domain.repo.RestaurantRepository;
import com.flashfoods.domain.repo.ReviewRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    record ReviewBody(@Min(1) @Max(5) int rating, @NotBlank String comment) {}

    private final CurrentUser currentUser;
    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;

    public ReviewController(CurrentUser currentUser, ReviewRepository reviewRepository, RestaurantRepository restaurantRepository) {
        this.currentUser = currentUser;
        this.reviewRepository = reviewRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Review> list(@PathVariable Long restaurantId) {
        Restaurant r = restaurantRepository.findById(restaurantId).orElseThrow();
        return reviewRepository.findByRestaurant(r);
    }

    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> create(@PathVariable Long restaurantId, @Valid @RequestBody ReviewBody body) {
        Restaurant r = restaurantRepository.findById(restaurantId).orElseThrow();
        Review review = new Review();
        review.setUser(currentUser.get());
        review.setRestaurant(r);
        review.setRating(body.rating());
        review.setComment(body.comment());
        reviewRepository.save(review);
        return ResponseEntity.ok(review);
    }
}

