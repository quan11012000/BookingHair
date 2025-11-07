package org.example.barber_backend.controller;

import org.example.barber_backend.entity.Customer;
import org.example.barber_backend.service.impl.CustomOAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/me")
    public Object me(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) return Map.of("authenticated", false);
        if (principal instanceof CustomOAuth2User) {
            CustomOAuth2User cu = (CustomOAuth2User) principal;
            Customer customer = cu.getCustomer();
            return Map.of(
                    "authenticated", true,
                    "id", customer.getCustomerId(),
                    "name", customer.getFullName(),
                    "email", customer.getEmail(),
                    "avatar", customer.getAvatar()
            );
        }
        // generic fallback
        return Map.of(
                "authenticated", true,
                "attributes", principal.getAttributes()
        );
    }
}