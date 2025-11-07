package org.example.barber_backend.service.impl;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    // Nếu bạn muốn thêm logic (vd: generate JWT) thì inject service ở đây

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        // Bạn có thể lấy user như:
        // CustomOAuth2User custom = (CustomOAuth2User) authentication.getPrincipal();
        // Customer customer = custom.getCustomer();

        // Simple behavior: redirect về frontend SPA, giữ session cookie (JSESSIONID)
        String targetUrl = "http://localhost:5178";

        // Optionally you can append a small flag or customer id (be careful with exposing ids)
        // Example: targetUrl += "?login=success";

        response.setStatus(HttpServletResponse.SC_FOUND);
        response.sendRedirect(targetUrl);
    }
}