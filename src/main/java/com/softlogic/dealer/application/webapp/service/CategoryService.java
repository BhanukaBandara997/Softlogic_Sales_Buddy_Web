package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {

    void save(Category category);

    List<Category> findAllByOrderByCategoryNameAsc();

    Optional<Category> findById(Integer userId);

    Category findByCategoryNameIgnoreCase(String categoryName);

    List<Category> getAllCategories();
}
