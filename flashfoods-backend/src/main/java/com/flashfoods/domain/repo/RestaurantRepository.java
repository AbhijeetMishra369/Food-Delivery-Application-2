package com.flashfoods.domain.repo;

import com.flashfoods.domain.entity.Restaurant;
import com.flashfoods.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByOwner(User owner);

    @Query("select r from Restaurant r where lower(r.name) like :term or lower(r.description) like :term or lower(r.city) like :term")
    List<Restaurant> search(@Param("term") String term);
}

