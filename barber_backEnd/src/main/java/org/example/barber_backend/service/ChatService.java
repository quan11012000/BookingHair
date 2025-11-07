package org.example.barber_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class ChatService {

    @Value("${google.api.key}")
    private String googleApiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=";

    private final RestTemplate restTemplate = new RestTemplate();

    // 🧠 Lưu hội thoại (có thể thay bằng Map<sessionId, List> nếu nhiều người chat)
    private final List<Map<String, Object>> conversation = new ArrayList<>();

    public String ask(String message) {
        return askWithImage(message, null);
    }

    public String askWithImage(String message, MultipartFile image) {
        try {
            List<Map<String, Object>> parts = new ArrayList<>();
            parts.add(Map.of("text", message != null ? message : ""));

            // Nếu có ảnh
            if (image != null && !image.isEmpty()) {
                String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
                parts.add(Map.of(
                        "inline_data", Map.of(
                                "mime_type", image.getContentType(),
                                "data", base64Image
                        )
                ));
            }

            // 🧑‍💬 Thêm câu hỏi người dùng
            conversation.add(Map.of("role", "user", "parts", parts));

            Map<String, Object> body = Map.of("contents", conversation);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    GEMINI_URL + googleApiKey,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> candidates =
                        (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> contentMap =
                            (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> partsList =
                            (List<Map<String, Object>>) contentMap.get("parts");
                    if (partsList != null && !partsList.isEmpty()) {
                        String reply = partsList.get(0).get("text").toString();

                        // 🤖 Thêm phản hồi bot vào hội thoại
                        conversation.add(Map.of(
                                "role", "model",
                                "parts", List.of(Map.of("text", reply))
                        ));

                        return reply;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Xin lỗi, em chưa hiểu ý anh 😅";
    }

    // 🔁 Làm mới hội thoại
    public void clearConversation() {
        conversation.clear();
    }

    // 👀 Xem lại lịch sử hội thoại (debug hoặc hiển thị UI)
    public List<Map<String, Object>> getConversation() {
        return conversation;
    }
}