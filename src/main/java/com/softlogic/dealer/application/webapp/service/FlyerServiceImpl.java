package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Flyer;
import com.softlogic.dealer.application.webapp.repository.FlyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlyerServiceImpl implements FlyerService {

    @Autowired
    private FlyerRepository flyerRepository;

    @Override
    public void save(Flyer flyer) {
        flyer.setFlyerName(flyer.getFlyerName());
        flyer.setFlyerLink(flyer.getFlyerLink());
        flyer.setFlyerImagePath(flyer.getFlyerImagePath());
        flyerRepository.save(flyer);
    }

    @Override
    public void delete(Flyer flyer) {
        flyerRepository.delete(flyer);
    }

    @Override
    public Optional<Flyer> findById(Integer flyerId) {
        return flyerRepository.findById(flyerId);
    }

    @Override
    public Flyer findByFlyerName(String flyerName) {
        return flyerRepository.findByFlyerNameIgnoreCase(flyerName);
    }

    @Override
    public List<Flyer> getAllFlyers() {
        return flyerRepository.findAll();
    }
}
