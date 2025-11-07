package org.example.barber_backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.barber_backend.dto.BookingCreateDto;
import org.example.barber_backend.dto.BookingDto;
import org.example.barber_backend.entity.Booking;
import org.example.barber_backend.service.impl.BookingServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BookingController {

    private final BookingServiceImpl bookingService;

    // ✅ Lấy toàn bộ booking (trả về DTO để frontend hiển thị)
    @GetMapping
    public ResponseEntity<List<BookingDto>> getAll() {
        return ResponseEntity.ok(bookingService.findAll());
    }

    // ✅ Lấy chi tiết 1 booking theo ID
    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.findById(id));
    }

    // ✅ Tạo mới booking
    @PostMapping
    public ResponseEntity<BookingDto> create(@RequestBody BookingCreateDto dto) {
        Booking booking = bookingService.createFromDto(dto);
        BookingDto bookingDto = bookingService.toDto(booking);
        return ResponseEntity.ok(bookingDto);
    }

    // ✅ Cập nhật booking
    @PutMapping("/{id}")
    public ResponseEntity<Booking> update(@PathVariable Integer id, @RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.update(id, booking));
    }

    // ✅ Xóa booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
