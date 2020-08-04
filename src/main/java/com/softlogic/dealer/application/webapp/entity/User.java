package com.softlogic.dealer.application.webapp.entity;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    @NotEmpty()
    private String name;

    @Column(nullable = false)
    @NotEmpty
    @Email(message = "{errors.invalid_email}")
    private String email;

    @Column(nullable = false)
    @NotEmpty
    @Size(min = 4)
    private String password;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(
            name = "user_role",
            joinColumns = {@JoinColumn(name = "USER_ID", referencedColumnName = "ID")},
            inverseJoinColumns = {@JoinColumn(name = "ROLE_ID", referencedColumnName = "ID")})
    private Set<Role> roles;

    private String affiliateCompany;

    private boolean accountExpired;

    private boolean accountLocked;

    private Integer soldProductsQty;

    public User() {
    }

    public User(Integer id, @NotEmpty() String name, @NotEmpty @Email(message = "{errors.invalid_email}") String email, @NotEmpty @Size(min = 4) String password, Set<Role> roles, String affiliateCompany, boolean accountExpired, boolean accountLocked, Integer soldProductsQty) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.affiliateCompany = affiliateCompany;
        this.accountExpired = accountExpired;
        this.accountLocked = accountLocked;
        this.soldProductsQty = soldProductsQty;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getAffiliateCompany() {
        return affiliateCompany;
    }

    public void setAffiliateCompany(String affiliateCompany) {
        this.affiliateCompany = affiliateCompany;
    }

    public boolean isAccountExpired() {
        return accountExpired;
    }

    public void setAccountExpired(boolean accountExpired) {
        this.accountExpired = accountExpired;
    }

    public boolean isAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(boolean accountLocked) {
        this.accountLocked = accountLocked;
    }

    public Integer getSoldProductsQty() {
        return soldProductsQty;
    }

    public void setSoldProductsQty(Integer soldProductsQty) {
        this.soldProductsQty = soldProductsQty;
    }
}
