package com.softlogic.dealer.application.webapp.repository;

import com.softlogic.dealer.application.webapp.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByName(String name);

    @Override
    void delete(Role role);

}
