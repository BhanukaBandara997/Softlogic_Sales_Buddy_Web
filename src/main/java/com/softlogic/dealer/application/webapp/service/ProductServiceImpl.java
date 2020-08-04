package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Category;
import com.softlogic.dealer.application.webapp.entity.Product;
import com.softlogic.dealer.application.webapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService{

    @Autowired
    ProductRepository productRepository;

    @Override
    public Integer save(Product product) {
        product.setProductName(product.getProductName());
        product.setProductImagePath(product.getProductImagePath());
        product.setProductLink(product.getProductLink());
        product.setProductSerialNo(product.getProductSerialNo());
        product.setProductDescription(product.getProductDescription());
        productRepository.save(product);
        return product.getProductId();
    }

    @Override
    public void saveCategory(Product product) {
        product.setCategory(product.getCategory());
        productRepository.save(product);
    }

    @Override
    public Optional<Product> findById(Integer productId) {
        return productRepository.findById(productId);
    }

    @Override
    public Product findByProductName(String productName) {
        return productRepository.findByProductNameIgnoreCase(productName);
    }

    @Override
    public List<Product> findByCategory_CategoryName(String categoryName) {
        return productRepository.findByCategory_CategoryName(categoryName);
    }

    @Override
    public void delete(Product product) {
        productRepository.delete(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByCategoryAsc();
    }

    @Override
    public Product findByProductSerialNo(String serialNo) {
        return productRepository.findByProductSerialNo(serialNo);
    }
}
