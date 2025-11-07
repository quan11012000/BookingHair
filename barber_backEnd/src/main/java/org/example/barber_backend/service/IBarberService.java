package org.example.barber_backend.service;

import org.example.barber_backend.entity.Barber;

import java.util.List;

public interface IBarberService {
    List<Barber> findAll();
    Barber findById(Integer id);
    Barber save(Barber barber);
    Barber update(Integer id, Barber barber);
    void delete(Integer id);
}
