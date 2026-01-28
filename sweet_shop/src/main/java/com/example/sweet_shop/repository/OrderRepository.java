package com.example.sweet_shop.repository;

import com.example.sweet_shop.model.Order;
import com.example.sweet_shop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ Fetch orders for a user (order history)
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
