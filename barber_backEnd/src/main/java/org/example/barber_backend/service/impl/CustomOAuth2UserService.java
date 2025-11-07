package org.example.barber_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.barber_backend.entity.Customer;
import org.example.barber_backend.repository.CustomerRepository;
import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final CustomerRepository customerRepository;

    @Override
    public OAuth2User loadUser(org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        OAuth2User oauth2User = super.loadUser(userRequest);
        Map<String, Object> attrs = oauth2User.getAttributes();

        // Google uses "sub" as unique id
        String googleId = (String) attrs.get("sub");
        String email = (String) attrs.get("email");
        String name = (String) attrs.get("name");
        String picture = (String) attrs.get("picture");

        Customer customer = customerRepository.findByGoogleId(googleId)
                .orElseGet(() -> {
                    // If email exists but googleId null (edge case), try to match by email
                    Customer byEmail = customerRepository.findByEmail(email).orElse(null);
                    if (byEmail != null) {
                        byEmail.setGoogleId(googleId);
                        if (byEmail.getAvatar() == null) byEmail.setAvatar(picture);
                        return customerRepository.save(byEmail);
                    }

                    Customer c = Customer.builder()
                            .googleId(googleId)
                            .email(email)
                            .fullName(name)
                            .avatar(picture)
                            .role(Customer.Role.CUSTOMER)
                            .build();
                    return customerRepository.save(c);
                });

        return new CustomOAuth2User(customer, oauth2User);
    }
}