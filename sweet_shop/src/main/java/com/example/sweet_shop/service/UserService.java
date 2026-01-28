package com.example.sweet_shop.service;

import com.example.sweet_shop.dto.RegisterRequest;
import com.example.sweet_shop.model.Role;
import com.example.sweet_shop.model.User;
import com.example.sweet_shop.repository.UserRepository;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Load Google Client ID from application.properties
    @Value("${google.client.id}")
    private String googleClientId;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================
    // ✅ REGISTER — USER ONLY
    // ==========================
    public User register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER); // USER by default

        return userRepository.save(user);
    }

    // ==========================
    // ✅ GET USER BY EMAIL
    // ==========================
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // ==========================
    // ✅ EMAIL + PASSWORD LOGIN
    // ==========================
    public boolean login(String email, String rawPassword) {
        User user = getByEmail(email);

        // ✅ Prevent login if password is null (Google-only users)
        if (user.getPassword() == null) {
            return false;
        }

        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    // ==========================
    // ✅ GOOGLE LOGIN — SAFE & NON-DESTRUCTIVE
    // ==========================
    @SuppressWarnings("deprecation")
    public User loginWithGoogle(String googleToken) {

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new JacksonFactory()
            )
                    .setAudience(Collections.singletonList(googleClientId)) // ✅ Config-based
                    .build();

            GoogleIdToken idToken = verifier.verify(googleToken);

            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            // ✅ If user already exists → DO NOT MODIFY
            User existingUser = userRepository.findByEmail(email).orElse(null);

            if (existingUser != null) {
                return existingUser;
            }

            // ✅ New Google user → create USER only
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(name != null ? name : "Google User");
            newUser.setPassword(null); // Google users have no password
            newUser.setRole(Role.USER); // Force USER role only

            return userRepository.save(newUser);

        } catch (Exception e) {
            throw new IllegalArgumentException("Google authentication failed");
        }
    }
}
