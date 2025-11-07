package org.example.barber_backend.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDto {
    private Integer bookingId;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String note;
    private String status;

    // Thông tin khách hàng
    private String customerName;
    private String customerPhone;

    // Thông tin thợ
    private String barberName;

    // Thông tin dịch vụ
    private String serviceName;

}
