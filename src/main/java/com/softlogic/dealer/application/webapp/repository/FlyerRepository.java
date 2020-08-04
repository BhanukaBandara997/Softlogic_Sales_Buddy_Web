package com.softlogic.dealer.application.webapp.repository;

import com.softlogic.dealer.application.webapp.entity.Flyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface FlyerRepository extends JpaRepository<Flyer, Integer> {

    Flyer findByFlyerNameIgnoreCase(String flyerName);

}
