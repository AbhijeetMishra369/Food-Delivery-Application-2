package com.flashfoods.web;

import com.flashfoods.domain.entity.User;
import com.flashfoods.domain.repo.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    record UpdateProfileBody(@NotBlank String fullName, String phone, String avatarUrl) {}

    private final CurrentUser currentUser;
    private final UserRepository userRepository;

    public UserController(CurrentUser currentUser, UserRepository userRepository) {
        this.currentUser = currentUser;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public User me() { return currentUser.get(); }

    @PutMapping("/me")
    public ResponseEntity<User> update(@Valid @RequestBody UpdateProfileBody body) {
        User u = currentUser.get();
        u.setFullName(body.fullName());
        u.setPhone(body.phone());
        u.setAvatarUrl(body.avatarUrl());
        userRepository.save(u);
        return ResponseEntity.ok(u);
    }
}

