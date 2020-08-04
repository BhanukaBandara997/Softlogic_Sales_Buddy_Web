package com.softlogic.dealer.application.webapp.repository;

import com.softlogic.dealer.application.webapp.entity.Role;
import com.softlogic.dealer.application.webapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByName(String username);

    User findByEmail(String email);

    Optional<User> findById(Integer userId);

    List<User> findByRolesIn(Set<Role> roles);
}
