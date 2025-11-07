package org.example.barber_backend.repository;

import org.example.barber_backend.entity.Customer;
import org.example.barber_backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByCustomerAndChatTypeOrderByCreatedAtAsc(Customer customer, Message.ChatType chatType);
}