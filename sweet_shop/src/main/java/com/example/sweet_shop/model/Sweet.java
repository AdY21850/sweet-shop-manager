package com.example.sweet_shop.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sweet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price; // restored to match service

    @Column(nullable = false)
    private int quantity; // restored

    private String category; // restored

    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;
}
