package com.flashfoods.web;

import com.flashfoods.domain.entity.MenuItem;
import com.flashfoods.domain.entity.Restaurant;
import com.flashfoods.domain.repo.MenuItemRepository;
import com.flashfoods.domain.repo.RestaurantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    public MenuController(MenuItemRepository menuItemRepository, RestaurantRepository restaurantRepository) {
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItem> list(@PathVariable Long restaurantId) {
        Restaurant r = restaurantRepository.findById(restaurantId).orElseThrow();
        return menuItemRepository.findAll().stream().filter(mi -> mi.getRestaurant() != null && mi.getRestaurant().getId().equals(r.getId())).toList();
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @PostMapping("/restaurant/{restaurantId}")
    public MenuItem create(@PathVariable Long restaurantId, @RequestBody MenuItem body) {
        Restaurant r = restaurantRepository.findById(restaurantId).orElseThrow();
        body.setRestaurant(r);
        return menuItemRepository.save(body);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> update(@PathVariable Long id, @RequestBody MenuItem body) {
        return menuItemRepository.findById(id).map(mi -> {
            mi.setName(body.getName());
            mi.setDescription(body.getDescription());
            mi.setImageUrl(body.getImageUrl());
            mi.setPriceCents(body.getPriceCents());
            mi.setAvailable(body.getAvailable());
            return ResponseEntity.ok(menuItemRepository.save(mi));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!menuItemRepository.existsById(id)) return ResponseEntity.notFound().build();
        menuItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}