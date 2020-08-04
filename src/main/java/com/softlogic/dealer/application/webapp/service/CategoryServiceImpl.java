package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Category;
import com.softlogic.dealer.application.webapp.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    @Override
    public void save(Category category) {
        category.setCategoryName(category.getCategoryName());
        category.setCategoryImagePath(category.getCategoryImagePath());
        categoryRepository.save(category);
    }

    @Override
    public List<Category> findAllByOrderByCategoryNameAsc() {
        return categoryRepository.findAllByOrderByCategoryNameAsc();
    }

    @Override
    public Optional<Category> findById(Integer categoryId) {
        return categoryRepository.findById(categoryId);
    }

    @Override
    public Category findByCategoryNameIgnoreCase(String categoryName) {
        return categoryRepository.findByCategoryNameIgnoreCase(categoryName);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderByIdAsc();
    }
}
