package com.example.sweet_shop.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Order belongs to a user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Order items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private double totalPrice;

    @Column(nullable = false)
    private String status = "PLACED"; // PLACED, CANCELLED, COMPLETED

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
