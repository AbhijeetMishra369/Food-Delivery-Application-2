package com.flashfoods.web;

import com.flashfoods.domain.entity.MenuItem;
import com.flashfoods.domain.entity.Restaurant;
import com.flashfoods.domain.entity.Role;
import com.flashfoods.domain.entity.User;
import com.flashfoods.domain.repo.MenuItemRepository;
import com.flashfoods.domain.repo.RestaurantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final CurrentUser currentUser;

    public RestaurantController(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository, CurrentUser currentUser) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<Restaurant> list(@RequestParam(value = "q", required = false) String q) {
        if (q == null || q.isBlank()) {
            return restaurantRepository.findAll();
        }
        String term = "%" + q.toLowerCase() + "%";
        return restaurantRepository.search(term);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> get(@PathVariable Long id) {
        return restaurantRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @PostMapping
    public Restaurant create(@RequestBody Restaurant restaurant) {
        if (restaurant.getOwner() == null) {
            restaurant.setOwner(currentUser.get());
        }
        return restaurantRepository.save(restaurant);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> update(@PathVariable Long id, @RequestBody Restaurant body) {
        User me = currentUser.get();
        return restaurantRepository.findById(id).map(r -> {
            if (!(me.getRole() == Role.ADMIN || (r.getOwner() != null && r.getOwner().getId().equals(me.getId())))) {
                return ResponseEntity.status(403).<Restaurant>build();
            }
            r.setName(body.getName());
            r.setDescription(body.getDescription());
            r.setAddress(body.getAddress());
            r.setCity(body.getCity());
            r.setLogoUrl(body.getLogoUrl());
            return ResponseEntity.ok(restaurantRepository.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        User me = currentUser.get();
        return restaurantRepository.findById(id).map(r -> {
            if (!(me.getRole() == Role.ADMIN || (r.getOwner() != null && r.getOwner().getId().equals(me.getId())))) {
                return ResponseEntity.status(403).build();
            }
            restaurantRepository.delete(r);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/menu")
    public List<MenuItem> listMenu(@PathVariable Long id) {
        return menuItemRepository.findByRestaurant(restaurantRepository.findById(id).orElseThrow());
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @GetMapping("/mine")
    public List<Restaurant> mine() {
        return restaurantRepository.findByOwner(currentUser.get());
    }
}

