package com.example.sweet_shop.service;

import com.example.sweet_shop.model.HeroSection;
import com.example.sweet_shop.repository.HeroSectionRepository;
import org.springframework.stereotype.Service;

@Service
public class HeroSectionService {

    private final HeroSectionRepository repo;

    public HeroSectionService(HeroSectionRepository repo) {
        this.repo = repo;
    }

    public HeroSection getActiveHero() {
        return repo.findByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active hero found"));
    }
}
