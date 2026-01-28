package com.example.sweet_shop.service;

import com.example.sweet_shop.exception.ResourceNotFoundException;
import com.example.sweet_shop.model.*;
import com.example.sweet_shop.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final SweetRepository sweetRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            SweetRepository sweetRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.sweetRepository = sweetRepository;
        this.userRepository = userRepository;
    }

    // ==========================
    // PLACE ORDER (CART → ORDER)
    // ==========================
    public Order placeOrder(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);

        double total = 0;

        for (CartItem cartItem : cart.getItems()) {

            Sweet sweet = sweetRepository.findById(cartItem.getSweet().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sweet not found"));

            if (sweet.getQuantity() < cartItem.getQuantity()) {
                throw new IllegalStateException("Not enough stock for " + sweet.getName());
            }

            // Reduce stock
            sweet.setQuantity(sweet.getQuantity() - cartItem.getQuantity());
            sweetRepository.save(sweet);

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setSweet(sweet);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(sweet.getPrice());

            order.getItems().add(orderItem);

            total += sweet.getPrice() * cartItem.getQuantity();
        }

        order.setTotalPrice(total);

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Clear cart after order
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    // ==========================
    // GET USER ORDER HISTORY
    // ==========================
    public List<Order> getOrdersForUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // ==========================
    // ADMIN: GET ALL ORDERS
    // ==========================
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
