package com.example.sweet_shop.controller;

import com.example.sweet_shop.model.User;
import com.example.sweet_shop.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==========================
    // GET LOGGED-IN USER PROFILE
    // ==========================
    @GetMapping
    public User getProfile(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ==========================
    // UPDATE PROFILE IMAGE URL
    // ==========================
    @PutMapping("/image")
    public User updateProfileImage(
            Authentication authentication,
            @RequestParam String imageUrl
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfileImageUrl(imageUrl);

        return userRepository.save(user);
    }
}
