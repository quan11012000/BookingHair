package org.example.barber_backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.barber_backend.entity.ServiceEntity;
import org.example.barber_backend.service.IServiceService;
import org.example.barber_backend.service.impl.ServiceServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ServiceController {

    private final IServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<ServiceEntity>> getAll() {
        return ResponseEntity.ok(serviceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceEntity> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(serviceService.findById(id));
    }

    @PostMapping("/upload")
    public ResponseEntity<ServiceEntity> uploadService(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam Integer durationMin,
            @RequestParam(required = false) MultipartFile imageFile
    ) throws IOException {

        ServiceEntity service = new ServiceEntity();
        service.setName(name);
        service.setDescription(description);
        service.setPrice(price);
        service.setDurationMin(durationMin);

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = System.currentTimeMillis() + "-" + StringUtils.cleanPath(imageFile.getOriginalFilename());

            // Lưu vào thư mục uploads trong root project
            File uploadDir = new File(System.getProperty("user.dir") + "/uploads");
            if (!uploadDir.exists()) uploadDir.mkdirs();

            File dest = new File(uploadDir, fileName);
            imageFile.transferTo(dest);

            service.setImage("/uploads/" + fileName);
        }

        ServiceEntity saved = serviceService.save(service);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceEntity> updateService(
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam Integer durationMin,
            @RequestParam(required = false) MultipartFile imageFile
    ) throws IOException {

        ServiceEntity service = new ServiceEntity();
        service.setName(name);
        service.setDescription(description);
        service.setPrice(price);
        service.setDurationMin(durationMin);

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = System.currentTimeMillis() + "-" + StringUtils.cleanPath(imageFile.getOriginalFilename());

            File uploadDir = new File(System.getProperty("user.dir") + "/uploads");
            if (!uploadDir.exists()) uploadDir.mkdirs();

            File dest = new File(uploadDir, fileName);
            imageFile.transferTo(dest);

            service.setImage("/uploads/" + fileName);
        }

        ServiceEntity updated = serviceService.update(id, service);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        serviceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
