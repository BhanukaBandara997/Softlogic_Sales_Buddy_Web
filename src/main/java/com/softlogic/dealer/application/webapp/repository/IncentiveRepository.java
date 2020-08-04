package com.softlogic.dealer.application.webapp.repository;

import com.softlogic.dealer.application.webapp.entity.Incentive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface IncentiveRepository extends JpaRepository<Incentive, Integer> {
}
