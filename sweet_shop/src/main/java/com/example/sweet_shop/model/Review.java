package com.example.sweet_shop.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "sweet_id"})
})
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reviewer
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Sweet being reviewed
    @ManyToOne
    @JoinColumn(name = "sweet_id", nullable = false)
    private Sweet sweet;

    @Column(nullable = false)
    private int rating; // 1–5 stars

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
