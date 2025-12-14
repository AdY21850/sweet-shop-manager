package com.example.sweet_shop.service;

import com.example.sweet_shop.dto.AddSweetRequest;
import com.example.sweet_shop.model.Sweet;
import com.example.sweet_shop.repository.SweetRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SweetServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private SweetService sweetService;

    // 1️⃣ getAllSweets
    @Test
    void testGetAllSweets() {
        Sweet sweet = new Sweet();
        sweet.setName("Rasgulla");

        when(sweetRepository.findAll()).thenReturn(List.of(sweet));

        List<Sweet> result = sweetService.getAllSweets();

        assertEquals(1, result.size());
        assertEquals("Rasgulla", result.get(0).getName());
    }

    // 2️⃣ addSweet
    @Test
    void testAddSweet() {
        AddSweetRequest request = new AddSweetRequest();
        request.setName("Ladoo");
        request.setCategory("Indian");
        request.setPrice(20);
        request.setQuantity(10);

        Sweet savedSweet = new Sweet();
        savedSweet.setName("Ladoo");

        when(sweetRepository.save(any(Sweet.class))).thenReturn(savedSweet);

        Sweet result = sweetService.addSweet(request);

        assertNotNull(result);
        assertEquals("Ladoo", result.getName());
    }

    // 3️⃣ purchaseSweet (success)
    @Test
    void testPurchaseSweetSuccess() {
        Sweet sweet = new Sweet();
        sweet.setId(1L);
        sweet.setQuantity(5);

        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));
        when(sweetRepository.save(any(Sweet.class))).thenReturn(sweet);

        Sweet result = sweetService.purchaseSweet(1L);

        assertEquals(4, result.getQuantity());
    }

    // 4️⃣ purchaseSweet (out of stock)
    @Test
    void testPurchaseSweetOutOfStock() {
        Sweet sweet = new Sweet();
        sweet.setId(1L);
        sweet.setQuantity(0);

        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> sweetService.purchaseSweet(1L)
        );

        assertEquals("Sweet out of stock", exception.getMessage());
    }
}
