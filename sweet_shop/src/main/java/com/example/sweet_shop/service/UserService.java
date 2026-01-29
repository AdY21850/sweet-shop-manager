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

    @Value("${google.client.id}")
    private String googleClientId;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================
    // ✅ EMAIL REGISTER
    // ==========================
    public User register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getUsername()); // FIXED fullName DB bug
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        return userRepository.save(user);
    }

    // ==========================
    // ✅ GET USER
    // ==========================
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // ==========================
    // ✅ EMAIL LOGIN
    // ==========================
    public boolean login(String email, String rawPassword) {
        User user = getByEmail(email);

        if (user.getPassword() == null) return false;

        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    // ==========================
    // ✅ GOOGLE LOGIN / REGISTER ENGINE
    // ==========================
    public User loginWithGoogle(String googleToken, boolean forceRegister) {

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new JacksonFactory()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(googleToken);

            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User existingUser = userRepository.findByEmail(email).orElse(null);

            // ❌ If registering but user exists
            if (forceRegister && existingUser != null) {
                throw new IllegalArgumentException("User already exists. Please login.");
            }

            // ✅ If logging in but user missing
            if (!forceRegister && existingUser == null) {
                throw new IllegalArgumentException("User not registered. Please sign up.");
            }

            // ✅ Existing user
            if (existingUser != null) {
                return existingUser;
            }

            // ✅ Create Google User
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(name != null ? name : "Google User");
            newUser.setFullName(name != null ? name : "Google User");
            newUser.setPassword(null);
            newUser.setRole(Role.USER);

            return userRepository.save(newUser);

        } catch (Exception e) {
            throw new IllegalArgumentException("Google authentication failed: " + e.getMessage());
        }
    }
}
