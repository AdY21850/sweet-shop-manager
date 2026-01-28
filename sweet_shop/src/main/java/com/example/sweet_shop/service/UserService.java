package com.example.sweet_shop.service;

import com.example.sweet_shop.dto.RegisterRequest;
import com.example.sweet_shop.model.Role;
import com.example.sweet_shop.model.User;
import com.example.sweet_shop.repository.UserRepository;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ EXISTING REGISTER FLOW — UNCHANGED
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

    // ✅ EXISTING FETCH USER — UNCHANGED
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // ✅ EXISTING LOGIN — UNCHANGED
    public boolean login(String email, String rawPassword) {
        User user = getByEmail(email);
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    // ==================================================
    // ✅ NEW: GOOGLE LOGIN — SAFE, NON-DESTRUCTIVE
    // ==================================================

    public User loginWithGoogle(String googleToken) {

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new JacksonFactory()
            ).setAudience(Collections.singletonList("YOUR_GOOGLE_CLIENT_ID"))
                    .build();

            GoogleIdToken idToken = verifier.verify(googleToken);

            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            // ✅ If user already exists → RETURN AS IS (DO NOT MODIFY)
            User existingUser = userRepository.findByEmail(email).orElse(null);

            if (existingUser != null) {
                return existingUser;
            }

            // ✅ If new Google user → create USER ONLY
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(name);
            newUser.setPassword(null); // No password for Google users
            newUser.setRole(Role.USER); // Force USER role

            return userRepository.save(newUser);

        } catch (Exception e) {
            throw new IllegalArgumentException("Google authentication failed");
        }
    }
}
