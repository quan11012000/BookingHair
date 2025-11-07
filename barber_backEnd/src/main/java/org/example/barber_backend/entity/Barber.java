package org.example.barber_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "barbers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Barber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer barberId;

    private String fullName;
    private String phoneNumber;
    private Integer experienceYears;
    private String status;
    @Column(columnDefinition = "TEXT")
    private String image;
    private LocalDate hireDate;
}
