package org.example.barber_backend.repository;


import org.example.barber_backend.entity.Booking;
import org.example.barber_backend.entity.Customer;
import org.example.barber_backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByCustomer(Customer customer);
    List<Feedback> findByBooking(Booking booking);
}