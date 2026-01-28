package com.example.sweet_shop.controller;

import com.example.sweet_shop.dto.LoginRequest;
import com.example.sweet_shop.dto.LoginResponse;
import com.example.sweet_shop.dto.RegisterRequest;
import com.example.sweet_shop.model.User;
import com.example.sweet_shop.service.UserService;
import com.example.sweet_shop.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = "https://sweet-shop-manager-rho.vercel.app",
        allowCredentials = "true"
)
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // ==========================
    // ✅ REGISTER — USER ONLY
    // ==========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            userService.register(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("User registered successfully");

        } catch (IllegalArgumentException ex) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ex.getMessage());
        }
    }

    // ==========================
    // ✅ GOOGLE LOGIN
    // ==========================
    @PostMapping("/google-login")
    public ResponseEntity<LoginResponse> googleLogin(@RequestBody String token) {

        try {
            User user = userService.loginWithGoogle(token);

            String jwt = jwtUtil.generateToken(user);

            return ResponseEntity.ok(
                    new LoginResponse(
                            true,
                            "Google login successful",
                            jwt,
                            user
                    )
            );

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(
                            false,
                            "Google login failed",
                            null,
                            null
                    ));
        }
    }

    // ==========================
    // ✅ EMAIL + PASSWORD LOGIN
    // ==========================
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        boolean success = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        if (!success) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(
                            false,
                            "Invalid credentials",
                            null,
                            null
                    ));
        }

        User user = userService.getByEmail(request.getEmail());

        // ✅ Role normalized for JWT
        String roleForJwt = user.getRole()
                .name()
                .replace("ROLE_", "");

        String token = jwtUtil.generateToken(
                user.getEmail(),
                roleForJwt
        );

        // ✅ Backward-compatible response
        return ResponseEntity.ok(
                new LoginResponse(
                        true,
                        "Login successful",
                        token,
                        user
                )
        );
    }
}
