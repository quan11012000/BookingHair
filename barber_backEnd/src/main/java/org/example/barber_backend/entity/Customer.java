package org.example.barber_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer customerId;

    private String fullName;
    private String phoneNumber;
    private String email;

    // 👉 Dùng cho đăng nhập Google
    @Column(unique = true)
    private String googleId;

    private String avatar;

    // 👉 Phân quyền (ADMIN / CUSTOMER)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.CUSTOMER;

    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        ADMIN,
        CUSTOMER
    }
}
