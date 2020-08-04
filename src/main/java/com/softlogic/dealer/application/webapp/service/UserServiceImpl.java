package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.config.WebSecurityConfig;
import com.softlogic.dealer.application.webapp.entity.Role;
import com.softlogic.dealer.application.webapp.entity.User;
import com.softlogic.dealer.application.webapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    private static final AtomicInteger counter = new AtomicInteger(3);

    public static int nextValue() {
        return counter.getAndIncrement();
    }

    @Override
    public void save(User user) {
        if (user.getId() == null && !(isNumeric(String.valueOf(user.getId())))){
            int userId = nextValue();
            user.setId(userId);
        }
        user.setPassword(WebSecurityConfig.passwordEncoder().encode(user.getPassword()));
        userRepository.save(user);
    }

    public static boolean isNumeric(String str) {
        try {
            Double.parseDouble(str);
            return true;
        } catch(NumberFormatException e){
            return false;
        }
    }

    @Override
    public User findByName(String username) {
        return userRepository.findByName(username);
    }

    @Override
    public User findByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail);
    }

    @Override
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> findById(Integer userId) {
        return userRepository.findById(userId);
    }

    @Override
    public void delete(User user) {
        userRepository.delete(user);
    }

    @Override
    public List<User> getAllUsers(Set<Role> roles) {
        return userRepository.findByRolesIn(roles);
    }

    @Override
    public List<User> getSalesPersons(Set<Role> roles) {
        return userRepository.findByRolesIn(roles);
    }
}
