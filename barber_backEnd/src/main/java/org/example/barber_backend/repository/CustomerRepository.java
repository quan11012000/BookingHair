package org.example.barber_backend.repository;

import org.example.barber_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByGoogleId(String googleId);
    Optional<Customer> findByEmail(String email);
}
