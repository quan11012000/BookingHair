package org.example.barber_backend.controller;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.barber_backend.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // hoặc "*" nếu đang dev
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // 🧠 Chat (có thể kèm ảnh)
    @PostMapping
    public ResponseEntity<Map<String, String>> chat(
            @RequestParam(value = "message", required = false) String message,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        String reply = chatService.askWithImage(message, image);
        return ResponseEntity.ok(Map.of("reply", reply));
    }

    // 🔁 Xóa hội thoại
    @PostMapping("/clear")
    public ResponseEntity<Void> clear() {
        chatService.clearConversation();
        return ResponseEntity.ok().build();
    }

    // 👀 Lấy lại lịch sử hội thoại (nếu cần)
    @GetMapping
    public ResponseEntity<Object> history() {
        return ResponseEntity.ok(chatService.getConversation());
    }
    // 👤 Chat với tư vấn viên (REST)
    @PostMapping("/advisor")
    public ResponseEntity<Map<String,String>> chatAdvisor(
            @AuthenticationPrincipal OAuth2User user,
            @RequestParam String message
    ){
        // Có thể lưu vào DB nếu muốn
        String reply = "Tin nhắn đã gửi tới tư vấn viên!";
        return ResponseEntity.ok(Map.of("reply", reply));
    }

}