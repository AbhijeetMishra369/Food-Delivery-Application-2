package com.flashfoods.web;

import com.flashfoods.domain.entity.Role;
import com.flashfoods.domain.entity.User;
import com.flashfoods.domain.repo.UserRepository;
import com.flashfoods.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    record RegisterRequest(@Email String email, @NotBlank String password, @NotBlank String fullName) {}
    record LoginRequest(@Email String email, @NotBlank String password) {}

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest body) {
        if (userRepository.existsByEmail(body.email())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already in use"));
        }
        User user = new User();
        user.setEmail(body.email());
        user.setPasswordHash(passwordEncoder.encode(body.password()));
        user.setFullName(body.fullName());
        user.setRole(Role.CUSTOMER);
        userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().name(), "name", user.getFullName()));
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest body) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(body.email(), body.password()));
        User user = userRepository.findByEmail(body.email()).orElseThrow();
        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().name(), "name", user.getFullName()));
        return ResponseEntity.ok(Map.of("token", token));
    }
}

