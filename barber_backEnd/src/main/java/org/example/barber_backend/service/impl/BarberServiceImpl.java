package org.example.barber_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.barber_backend.entity.Barber;
import org.example.barber_backend.repository.BarberRepository;
import org.example.barber_backend.service.IBarberService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BarberServiceImpl implements IBarberService {

    private final BarberRepository barberRepository;

    @Override
    public List<Barber> findAll() {
        return barberRepository.findAll();
    }

    @Override
    public Barber findById(Integer id) {
        return barberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy barber có ID: " + id));
    }

    @Override
    public Barber save(Barber barber) {
        return barberRepository.save(barber);
    }

    @Override
    public Barber update(Integer id, Barber barber) {
        Barber existing = findById(id);
        existing.setFullName(barber.getFullName());
        existing.setPhoneNumber(barber.getPhoneNumber());
        existing.setExperienceYears(barber.getExperienceYears());
        existing.setStatus(barber.getStatus());
        existing.setHireDate(barber.getHireDate());
        existing.setImage(barber.getImage());
        return barberRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        barberRepository.deleteById(id);
    }
}