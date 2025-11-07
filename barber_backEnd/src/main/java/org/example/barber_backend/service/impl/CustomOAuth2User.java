package org.example.barber_backend.service.impl;
import org.example.barber_backend.entity.Customer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    private final Customer customer;
    private final OAuth2User oauth2User;

    public CustomOAuth2User(Customer customer, OAuth2User oauth2User) {
        this.customer = customer;
        this.oauth2User = oauth2User;
    }

    public Customer getCustomer() {
        return customer;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2User.getAuthorities();
    }

    @Override
    public String getName() {
        // fallback: google sub or email
        Object sub = oauth2User.getAttribute("sub");
        if (sub != null) return sub.toString();
        Object name = oauth2User.getAttribute("name");
        return name != null ? name.toString() : customer.getCustomerId().toString();
    }
}