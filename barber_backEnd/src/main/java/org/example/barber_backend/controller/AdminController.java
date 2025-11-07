package org.example.barber_backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.barber_backend.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins ="*")
@RequiredArgsConstructor
public class AdminController {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        return adminRepository.findByUsername(username)
                .filter(admin -> passwordEncoder.matches(password, admin.getPassword()))
                .map(admin -> ResponseEntity.ok(Map.of(
                        "adminId", admin.getAdminId(),
                        "fullName", admin.getFullName(),
                        "username", admin.getUsername(),
                        "email", admin.getEmail(),
                        "phoneNumber", admin.getPhoneNumber(),
                        "role", admin.getRole(),
                        "createdAt", admin.getCreatedAt()
                )))
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Sai tài khoản hoặc mật khẩu")));
    }
}