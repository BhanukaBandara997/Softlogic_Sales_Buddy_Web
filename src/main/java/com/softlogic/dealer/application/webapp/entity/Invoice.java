package com.softlogic.dealer.application.webapp.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceId;

    private String invoiceImagePath;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private Set<Product> products;

    private Integer totalProductsQty;

    public Invoice() {
        products = new HashSet<>();
    }

    public Invoice(Long id, String invoiceId, String invoiceImagePath, User user, Set<Product> products, Integer totalProductsQty) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.invoiceImagePath = invoiceImagePath;
        this.user = user;
        this.products = products;
        this.totalProductsQty = totalProductsQty;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(String invoiceId) {
        this.invoiceId = invoiceId;
    }

    public String getInvoiceImagePath() {
        return invoiceImagePath;
    }

    public void setInvoiceImagePath(String invoiceImagePath) {
        this.invoiceImagePath = invoiceImagePath;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Product> getProducts() {
        return products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
        for (Product product : products) {
            product.setInvoice(this);
        }
    }

    public Integer getTotalProductsQty() {
        return totalProductsQty;
    }

    public void setTotalProductsQty(Integer totalProductsQty) {
        this.totalProductsQty = totalProductsQty;
    }
}
