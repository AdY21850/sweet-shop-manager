package com.example.sweet_shop.controller;

import com.example.sweet_shop.model.HeroSection;
import com.example.sweet_shop.service.HeroSectionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hero")
public class HeroSectionController {

    private final HeroSectionService service;

    public HeroSectionController(HeroSectionService service) {
        this.service = service;
    }

    @GetMapping("/active")
    public HeroSection getHero() {
        return service.getActiveHero();
    }
}
