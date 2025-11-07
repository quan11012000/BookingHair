package org.example.barber_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer serviceId;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double price;

    private Integer durationMin;

    @Column(columnDefinition = "TEXT")
    private String image; // URL ảnh minh hoạ dịch vụ
}
