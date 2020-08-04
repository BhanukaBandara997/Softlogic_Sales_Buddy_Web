package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Category;
import com.softlogic.dealer.application.webapp.entity.Product;
import com.softlogic.dealer.application.webapp.repository.CategoryRepository;
import com.softlogic.dealer.application.webapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService{

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ProductRepository productRepository;

//    Product Related
    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

//    Category Related
    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
