package com.aistudyassistant.controller;

import com.aistudyassistant.dto.AuthResponse;
import com.aistudyassistant.dto.LoginRequest;
import com.aistudyassistant.dto.RegisterRequest;
import com.aistudyassistant.dto.UserResponse;
import com.aistudyassistant.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        UserResponse user = authService.getCurrentUser();
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT tokens are stateless, so logout is handled on client side
        return ResponseEntity.ok().body("Logged out successfully");
    }
}
