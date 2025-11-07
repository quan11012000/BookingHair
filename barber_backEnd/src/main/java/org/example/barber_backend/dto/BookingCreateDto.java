package org.example.barber_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateDto {
    private Integer customerId;
    private Integer barberId;
    private Integer serviceId;
    private String bookingDate;  // hoặc LocalDate
    private String bookingTime;  // hoặc LocalTime
    private String note;
    private String status;
}
