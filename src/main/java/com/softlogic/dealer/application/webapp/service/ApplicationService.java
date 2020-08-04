package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Category;
import com.softlogic.dealer.application.webapp.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

public interface ApplicationService {

    //    Product Related
    Product createProduct(Product product);
    List<Product> getAllProducts();

    //    Category Related
    Category createCategory(Category category);
    List<Category> getAllCategories();

}
