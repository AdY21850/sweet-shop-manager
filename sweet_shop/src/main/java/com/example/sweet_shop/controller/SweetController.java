package com.example.sweet_shop.controller;

import com.example.sweet_shop.dto.AddSweetRequest;
import com.example.sweet_shop.model.Sweet;
import com.example.sweet_shop.service.SweetService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetService sweetService;

    public SweetController(SweetService sweetService) {
        this.sweetService = sweetService;
    }

    // Public - list all sweets
    @GetMapping
    public List<Sweet> getAllSweets() {
        return sweetService.getAllSweets();
    }

    // ADMIN only - add sweet
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Sweet addSweet(@Valid @RequestBody AddSweetRequest request) {
        return sweetService.addSweet(request);
    }

    // USER - purchase sweet
    @PutMapping("/{id}/purchase")
    public Sweet purchaseSweet(@PathVariable Long id) {
        return sweetService.purchaseSweet(id);
    }

    // Search with multiple filters
    @GetMapping("/search")
    public List<Sweet> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        return sweetService.search(name, category, minPrice, maxPrice);
    }
}
