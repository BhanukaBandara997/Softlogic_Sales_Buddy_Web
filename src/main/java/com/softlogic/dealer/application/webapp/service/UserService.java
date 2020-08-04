package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Product;
import com.softlogic.dealer.application.webapp.entity.Role;
import com.softlogic.dealer.application.webapp.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserService {

    void save(User user);

    User findByName(String username);

    User findByEmail(String userEmail);

    Optional<User> findById(Long userId);

    Optional<User> findById(Integer userId);

    void delete(User user);

    List<User> getAllUsers(Set<Role> roles);

    List<User> getSalesPersons(Set<Role> roles);
}
