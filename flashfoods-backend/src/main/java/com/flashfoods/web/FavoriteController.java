package com.flashfoods.web;

import com.flashfoods.domain.entity.Favorite;
import com.flashfoods.domain.entity.Restaurant;
import com.flashfoods.domain.repo.FavoriteRepository;
import com.flashfoods.domain.repo.RestaurantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private final CurrentUser currentUser;
    private final FavoriteRepository favoriteRepository;
    private final RestaurantRepository restaurantRepository;

    public FavoriteController(CurrentUser currentUser, FavoriteRepository favoriteRepository, RestaurantRepository restaurantRepository) {
        this.currentUser = currentUser;
        this.favoriteRepository = favoriteRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping
    public List<Favorite> list() {
        return favoriteRepository.findByUser(currentUser.get());
    }

    @PostMapping("/{restaurantId}")
    public ResponseEntity<?> add(@PathVariable Long restaurantId) {
        Restaurant r = restaurantRepository.findById(restaurantId).orElseThrow();
        if (favoriteRepository.findByUserAndRestaurant(currentUser.get(), r).isPresent()) return ResponseEntity.ok().build();
        Favorite f = new Favorite();
        f.setUser(currentUser.get());
        f.setRestaurant(r);
        favoriteRepository.save(f);
        return ResponseEntity.ok(f);
    }

    @DeleteMapping("/{restaurantId}")
    public ResponseEntity<?> remove(@PathVariable Long restaurantId) {
        Restaurant r = restaurantRepository.findById(restaurantId).orElseThrow();
        favoriteRepository.findByUserAndRestaurant(currentUser.get(), r).ifPresent(favoriteRepository::delete);
        return ResponseEntity.noContent().build();
    }
}

