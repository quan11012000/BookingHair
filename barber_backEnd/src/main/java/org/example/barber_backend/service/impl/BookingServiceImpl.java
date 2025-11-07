package org.example.barber_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.barber_backend.dto.BookingCreateDto;
import org.example.barber_backend.dto.BookingDto;
import org.example.barber_backend.entity.Booking;
import org.example.barber_backend.repository.BarberRepository;
import org.example.barber_backend.repository.BookingRepository;
import org.example.barber_backend.repository.CustomerRepository;
import org.example.barber_backend.repository.ServiceRepository;
import org.example.barber_backend.service.IBookingService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements IBookingService {

    private final BookingRepository bookingRepository;
    private final ModelMapper modelMapper;
    private final CustomerRepository customerRepository;
    private final BarberRepository barberRepository;
    private final ServiceRepository serviceRepository;

    private BookingDto convertToDto(Booking b) {
        BookingDto dto = modelMapper.map(b, BookingDto.class);

        if (b.getCustomer() != null) {
            dto.setCustomerName(b.getCustomer().getFullName());
            dto.setCustomerPhone(b.getCustomer().getPhoneNumber());
        }
        if (b.getBarber() != null) {
            dto.setBarberName(b.getBarber().getFullName());
        }
        if (b.getService() != null) {
            dto.setServiceName(b.getService().getName());
        }

        return dto;
    }

    @Override
    public List<BookingDto> findAll() {
        return bookingRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public BookingDto findById(Integer id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking có ID: " + id));
        return convertToDto(b);
    }

    @Override
    public Booking create(Booking booking) {
        booking.setCreatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    @Override
    public Booking update(Integer id, Booking booking) {
        Booking existing = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking để cập nhật"));

        existing.setCustomer(booking.getCustomer());
        existing.setBarber(booking.getBarber());
        existing.setService(booking.getService());
        existing.setAdmin(booking.getAdmin());
        existing.setBookingDate(booking.getBookingDate());
        existing.setBookingTime(booking.getBookingTime());
        existing.setNote(booking.getNote());
        existing.setStatus(booking.getStatus());

        return bookingRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        bookingRepository.deleteById(id);
    }

    public Booking createSimpleBooking(BookingDto dto) {
        Booking booking = modelMapper.map(dto, Booking.class);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public Booking createFromDto(BookingCreateDto dto) {
        Booking booking = new Booking();
        booking.setCustomer(customerRepository.findById(dto.getCustomerId()).orElseThrow());
        booking.setBarber(barberRepository.findById(dto.getBarberId()).orElseThrow());
        booking.setService(serviceRepository.findById(dto.getServiceId()).orElseThrow());
        booking.setBookingDate(LocalDate.parse(dto.getBookingDate()));
        booking.setBookingTime(LocalTime.parse(dto.getBookingTime()));
        booking.setNote(dto.getNote());
        booking.setStatus(dto.getStatus());
        booking.setCreatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }
    public BookingDto toDto(Booking booking) {
        if (booking == null) return null;

        return BookingDto.builder()
                .bookingId(booking.getBookingId())
                .bookingDate(booking.getBookingDate())
                .bookingTime(booking.getBookingTime())
                .note(booking.getNote())
                .status(booking.getStatus())
                .customerName(booking.getCustomer() != null ? booking.getCustomer().getFullName() : null)
                .customerPhone(booking.getCustomer() != null ? booking.getCustomer().getPhoneNumber() : null)
                .barberName(booking.getBarber() != null ? booking.getBarber().getFullName() : null)
                .serviceName(booking.getService() != null ? booking.getService().getName() : null)
                .build();
    }
}
