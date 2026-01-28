package com.example.sweet_shop.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Link to Sweet
    @ManyToOne
    @JoinColumn(name = "sweet_id", nullable = false)
    private Sweet sweet;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price; // price per unit at purchase time
}
