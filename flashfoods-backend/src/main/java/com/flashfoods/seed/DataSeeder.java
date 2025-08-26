package com.flashfoods.seed;

import com.flashfoods.domain.entity.MenuItem;
import com.flashfoods.domain.entity.Restaurant;
import com.flashfoods.domain.entity.Role;
import com.flashfoods.domain.entity.User;
import com.flashfoods.domain.repo.MenuItemRepository;
import com.flashfoods.domain.repo.RestaurantRepository;
import com.flashfoods.domain.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
@Profile({"default"})
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      RestaurantRepository restaurantRepository,
                      MenuItemRepository menuItemRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedRestaurantsAndMenu();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@flashfoods.com")) {
            User admin = new User();
            admin.setEmail("admin@flashfoods.com");
            admin.setFullName("Site Administrator");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
        if (!userRepository.existsByEmail("owner@flashfoods.com")) {
            User owner = new User();
            owner.setEmail("owner@flashfoods.com");
            owner.setFullName("Default Owner");
            owner.setPasswordHash(passwordEncoder.encode("owner123"));
            owner.setRole(Role.OWNER);
            userRepository.save(owner);
        }
        if (!userRepository.existsByEmail("customer@flashfoods.com")) {
            User customer = new User();
            customer.setEmail("customer@flashfoods.com");
            customer.setFullName("Demo Customer");
            customer.setPasswordHash(passwordEncoder.encode("customer123"));
            customer.setRole(Role.CUSTOMER);
            userRepository.save(customer);
        }
    }

    private void seedRestaurantsAndMenu() {
        if (restaurantRepository.count() > 3) {
            return; // already seeded
        }

        User owner = userRepository.findByEmail("owner@flashfoods.com").orElseThrow();
        List<String> restaurantImages = List.of(
                "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1546069901-eacef0df6022?w=1200&auto=format&fit=crop"
        );
        List<String> dishImages = List.of(
                "https://images.unsplash.com/photo-1604908176997-431632bed5d8?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1543352634-8730d3b6c0e8?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop"
        );

        String[] names = new String[]{
                "Spice Garden", "Urban Bites", "Royal Biryani House", "Sushi Zen", "Pasta Palace",
                "Burger Hub", "Curry Corner", "Taco Fiesta", "Dim Sum Delight", "Grill Masters"
        };
        String[] cities = new String[]{"Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune"};
        String[] descriptions = new String[]{
                "Delicious Indian cuisine", "Fast and fresh bites", "Authentic Hyderabadi biryani",
                "Fresh sushi and sashimi", "Italian pastas and sauces", "Juicy burgers and fries",
                "Spicy curries and naan", "Mexican street flavors", "Handmade dumplings", "BBQ and grills"
        };

        Random rnd = new Random();

        for (int i = 0; i < names.length; i++) {
            Restaurant r = new Restaurant();
            r.setName(names[i]);
            r.setDescription(descriptions[i % descriptions.length]);
            r.setCity(cities[rnd.nextInt(cities.length)]);
            r.setAddress("Main Street " + (100 + i));
            r.setLogoUrl(restaurantImages.get(i % restaurantImages.size()));
            r.setOwner(owner);
            restaurantRepository.save(r);

            // 8-12 dishes per restaurant
            int numDishes = 8 + rnd.nextInt(5);
            for (int d = 0; d < numDishes; d++) {
                MenuItem mi = new MenuItem();
                mi.setRestaurant(r);
                mi.setName(sampleDishName(d));
                mi.setDescription("Chef's special " + mi.getName());
                mi.setImageUrl(dishImages.get((i + d) % dishImages.size()));
                int price = 99 + rnd.nextInt(400);
                mi.setPriceCents(price * 100 / 1);
                mi.setAvailable(true);
                menuItemRepository.save(mi);
            }
        }
    }

    private String sampleDishName(int idx) {
        String[] dishNames = new String[]{
                "Margherita Pizza", "Butter Chicken", "Paneer Tikka", "Veg Biryani", "Chicken Wings",
                "Sushi Platter", "Dim Sum Basket", "Spaghetti Alfredo", "BBQ Ribs", "Tacos Al Pastor",
                "Caesar Salad", "Chocolate Brownie", "Gulab Jamun", "Masala Dosa", "Pav Bhaji"
        };
        return dishNames[idx % dishNames.length];
    }
}

