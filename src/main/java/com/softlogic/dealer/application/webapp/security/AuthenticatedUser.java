package com.softlogic.dealer.application.webapp.security;

import com.softlogic.dealer.application.webapp.entity.Role;
import com.softlogic.dealer.application.webapp.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;


public class AuthenticatedUser extends org.springframework.security.core.userdetails.User {

    private static final long serialVersionUID = 1L;
    private User user;

    public AuthenticatedUser(User user) {
        super(user.getEmail(), user.getPassword(), getAuthorities(user));
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    private static Collection<? extends GrantedAuthority> getAuthorities(User user) {
        Set<String> roleAndPermissions = new HashSet<>();
        Set<Role> roles = user.getRoles();

        for (Role role : roles) {
            roleAndPermissions.add(role.getName());
        }
        String[] roleNames = new String[roleAndPermissions.size()];
        Collection<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList(roleAndPermissions.toArray(roleNames));
        return authorities;
    }
}
