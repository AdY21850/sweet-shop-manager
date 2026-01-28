package com.example.sweet_shop.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to cart
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    // Link to sweet
    @ManyToOne
    @JoinColumn(name = "sweet_id", nullable = false)
    private Sweet sweet;

    @Column(nullable = false)
    private int quantity = 1;
}
