package org.example.barber_backend.controller;

import org.example.barber_backend.dto.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // User gửi tin nhắn → server gửi tới admin
    @MessageMapping("/sendMessage")
    public void sendMessage(ChatMessage message) {
        // gửi tới tất cả subscribe /topic/admin
        messagingTemplate.convertAndSend("/topic/admin", message);
    }
}
