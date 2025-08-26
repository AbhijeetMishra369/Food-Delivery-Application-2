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

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    record RegisterRequest(@Email String email, @NotBlank String password, @NotBlank String fullName) {}
    record RegisterOwnerRequest(@Email String email, @NotBlank String password, @NotBlank String fullName) {}
    record LoginRequest(@Email String email, @NotBlank String password) {}
    record ForgotPasswordRequest(@Email String email) {}
    record ResetPasswordRequest(@NotBlank String token, @NotBlank String newPassword) {}

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MailService mailService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, MailService mailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.mailService = mailService;
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

    @PostMapping("/register-owner")
    public ResponseEntity<?> registerOwner(@Valid @RequestBody RegisterOwnerRequest body) {
        if (userRepository.existsByEmail(body.email())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already in use"));
        }
        User user = new User();
        user.setEmail(body.email());
        user.setPasswordHash(passwordEncoder.encode(body.password()));
        user.setFullName(body.fullName());
        user.setRole(Role.OWNER);
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

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@Valid @RequestBody ForgotPasswordRequest body) {
        User user = userRepository.findByEmail(body.email()).orElse(null);
        if (user == null) return ResponseEntity.ok(Map.of("message", "If the email exists, a reset link will be sent"));
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiresAt(Instant.now().plusSeconds(3600));
        userRepository.save(user);
        mailService.send(body.email(), "Password Reset", "Your reset token: " + token);
        return ResponseEntity.ok(Map.of("message", "Reset email sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(@Valid @RequestBody ResetPasswordRequest body) {
        User user = userRepository.findAll().stream()
                .filter(u -> body.token().equals(u.getResetToken()) && u.getResetTokenExpiresAt() != null && u.getResetTokenExpiresAt().isAfter(Instant.now()))
                .findFirst().orElse(null);
        if (user == null) return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired token"));
        user.setPasswordHash(passwordEncoder.encode(body.newPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiresAt(null);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }
}

