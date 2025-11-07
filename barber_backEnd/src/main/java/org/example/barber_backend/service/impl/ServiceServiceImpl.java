package org.example.barber_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.barber_backend.entity.ServiceEntity;
import org.example.barber_backend.repository.ServiceRepository;
import org.example.barber_backend.service.IServiceService;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ServiceServiceImpl implements IServiceService {

    private final ServiceRepository serviceRepository;

    @Override
    public List<ServiceEntity> findAll() {
        return serviceRepository.findAll();
    }

    @Override
    public ServiceEntity findById(Integer id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ có ID: " + id));
    }

    @Override
    public ServiceEntity save(ServiceEntity service) {
        return serviceRepository.save(service);
    }

    @Override
    public ServiceEntity update(Integer id, ServiceEntity service) {
        ServiceEntity existing = findById(id);
        existing.setName(service.getName());
        existing.setDescription(service.getDescription());
        existing.setPrice(service.getPrice());
        existing.setDurationMin(service.getDurationMin());
        if (service.getImage() != null) {
            existing.setImage(service.getImage());
        }
        return serviceRepository.save(existing);
    }
    @Override
    public void delete(Integer id) {
        serviceRepository.deleteById(id);
    }
}