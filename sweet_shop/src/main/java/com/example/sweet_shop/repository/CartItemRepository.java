package com.example.sweet_shop.repository;

import com.example.sweet_shop.model.Cart;
import com.example.sweet_shop.model.CartItem;
import com.example.sweet_shop.model.Sweet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // ✅ Find item by cart + sweet (avoid duplicates)
    Optional<CartItem> findByCartAndSweet(Cart cart, Sweet sweet);
}
