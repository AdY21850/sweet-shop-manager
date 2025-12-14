package com.example.sweet_shop.dto;

import com.example.sweet_shop.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private User user;
}
