package com.flashfoods;

import com.flashfoods.domain.entity.*;
import com.flashfoods.domain.repo.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class BootstrapData {
    @Bean
    CommandLineRunner seed(UserRepository users, RestaurantRepository restaurants, MenuItemRepository menuItems, PasswordEncoder encoder) {
        return args -> {
            if (users.count() > 0) return;
            User owner = new User();
            owner.setEmail("owner@flashfoods.test");
            owner.setPasswordHash(encoder.encode("owner123"));
            owner.setFullName("Demo Owner");
            owner.setRole(Role.OWNER);
            users.save(owner);

            User customer = new User();
            customer.setEmail("customer@flashfoods.test");
            customer.setPasswordHash(encoder.encode("cust123"));
            customer.setFullName("Demo Customer");
            customer.setRole(Role.CUSTOMER);
            users.save(customer);

            Restaurant r = new Restaurant();
            r.setName("Spice Garden");
            r.setDescription("Delicious Indian cuisine");
            r.setCity("Bengaluru");
            r.setOwner(owner);
            restaurants.save(r);

            MenuItem m1 = new MenuItem();
            m1.setRestaurant(r);
            m1.setName("Margherita Pizza");
            m1.setDescription("Classic cheese & basil");
            m1.setPriceCents(19900);
            m1.setImageUrl("https://images.unsplash.com/photo-1548365328-9f547fb095de?q=80&w=1200&auto=format&fit=crop");
            menuItems.save(m1);

            MenuItem m2 = new MenuItem();
            m2.setRestaurant(r);
            m2.setName("Veg Hakka Noodles");
            m2.setDescription("Wok tossed noodles");
            m2.setPriceCents(17900);
            m2.setImageUrl("https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=1200&auto=format&fit=crop");
            menuItems.save(m2);
        };
    }
}