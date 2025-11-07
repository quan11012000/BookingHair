package org.example.barber_backend.service;

import org.example.barber_backend.entity.ServiceEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IServiceService {
    List<ServiceEntity> findAll();
    ServiceEntity findById(Integer id);
    ServiceEntity save(ServiceEntity service);
    ServiceEntity update(Integer id, ServiceEntity service);
    void delete(Integer id);
}
