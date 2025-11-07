package org.example.barber_backend.service;

import org.example.barber_backend.dto.BookingDto;
import org.example.barber_backend.entity.Booking;

import java.util.List;

public interface IBookingService {
    List<BookingDto> findAll();
    BookingDto findById(Integer id);
    Booking create(Booking booking);
    Booking update(Integer id, Booking booking);
    void delete(Integer id);
}
