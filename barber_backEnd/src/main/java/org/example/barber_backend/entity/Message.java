package org.example.barber_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👉 Ai gửi: customer / staff / AI
    @Column(nullable = false)
    private String senderType;

    @Column(columnDefinition = "TEXT")
    private String content;

    // 👉 Nếu tin nhắn là ảnh (tuỳ chọn)
    private String imageUrl;

    // 👉 Gắn với người dùng (Customer)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ✅ Xác định loại chat (AI hoặc ADMIN)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatType chatType;

    public enum ChatType {
        AI,
        ADMIN
    }
}
