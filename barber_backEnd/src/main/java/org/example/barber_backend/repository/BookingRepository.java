package org.example.barber_backend.repository;


import org.example.barber_backend.entity.Barber;
import org.example.barber_backend.entity.Booking;
import org.example.barber_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByCustomer(Customer customer);
    List<Booking> findByBarber(Barber barber);
    List<Booking> findByStatus(String status);
}