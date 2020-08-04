package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Category;
import com.softlogic.dealer.application.webapp.entity.Product;
import com.softlogic.dealer.application.webapp.entity.User;

import java.util.List;
import java.util.Optional;

public interface ProductService {

    Integer save(Product product);

    void saveCategory(Product product);

    Optional<Product> findById(Integer userId);

    Product findByProductName(String productName);

    List<Product> findByCategory_CategoryName(String categoryName);

    void delete(Product product);

    List<Product> getAllProducts();

    Product findByProductSerialNo(String serialNo);

}
