package org.example.barber_backend.dto;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;     // "customer" hoặc "staff"
    private String content;

    private String roomId;     // Nếu có nhiều phòng chat
    private LocalDateTime createdAt;
}