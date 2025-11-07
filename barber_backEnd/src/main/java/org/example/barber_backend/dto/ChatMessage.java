package org.example.barber_backend.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String sender;  // "customer" hoặc "staff"
    private String content;
}