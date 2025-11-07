package org.example.barber_backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.barber_backend.entity.Barber;
import org.example.barber_backend.service.impl.BarberServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import java.util.List;


@RestController
@RequestMapping("/api/barbers")
@CrossOrigin(origins = "*") // React
@RequiredArgsConstructor
public class BarberController {

    private final BarberServiceImpl barberService;

    @GetMapping
    public ResponseEntity<List<Barber>> getAll() {
        return ResponseEntity.ok(barberService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Barber> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(barberService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Barber> create(@RequestBody Barber barber) {
        return ResponseEntity.ok(barberService.save(barber));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Barber> update(@PathVariable Integer id, @RequestBody Barber barber) {
        return ResponseEntity.ok(barberService.update(id, barber));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        barberService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ✨ Upload ảnh barber
    @PostMapping("/upload")
    public ResponseEntity<Barber> uploadBarber(
            @RequestParam String fullName,
            @RequestParam String phoneNumber,
            @RequestParam Integer experienceYears,
            @RequestParam String status,
            @RequestParam String hireDate,
            @RequestParam(required = false) MultipartFile imageFile
    ) throws IOException {

        Barber barber = new Barber();
        barber.setFullName(fullName);
        barber.setPhoneNumber(phoneNumber);
        barber.setExperienceYears(experienceYears);
        barber.setStatus(status);
        if (hireDate != null && !hireDate.isEmpty()) {
            barber.setHireDate(java.time.LocalDate.parse(hireDate));
        }

        // Lưu file nếu có
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = System.currentTimeMillis() + "-" + StringUtils.cleanPath(imageFile.getOriginalFilename());

            // Lưu vào thư mục uploads trong root project
            File uploadDir = new File(System.getProperty("user.dir") + "/uploads");
            if (!uploadDir.exists()) uploadDir.mkdirs();

            File dest = new File(uploadDir, fileName);
            imageFile.transferTo(dest);

            // Đường dẫn để frontend truy cập
            barber.setImage("/uploads/" + fileName);
        }


        Barber saved = barberService.save(barber);
        return ResponseEntity.ok(saved);
    }
}