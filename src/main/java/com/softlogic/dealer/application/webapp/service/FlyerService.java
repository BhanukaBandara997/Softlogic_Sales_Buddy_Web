package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Flyer;

import java.util.List;
import java.util.Optional;

public interface FlyerService {

    void save(Flyer flyer);

    void delete(Flyer flyer);

    Optional<Flyer> findById(Integer flyerId);

    Flyer findByFlyerName(String flyerName);

    List<Flyer> getAllFlyers();
}
