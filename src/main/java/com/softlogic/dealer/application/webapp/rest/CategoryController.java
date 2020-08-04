package com.softlogic.dealer.application.webapp.rest;

import com.softlogic.dealer.application.webapp.entity.Category;
import com.softlogic.dealer.application.webapp.repository.CategoryRepository;
import com.softlogic.dealer.application.webapp.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rest")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryService categoryService;

    @GetMapping(value = "/updateCategory")
    public void updateCategory(Category category) {
        categoryRepository.save(category);
    }

    @GetMapping(value = "/deleteCategory")
    public void deleteCategory(Category category) {
        categoryRepository.delete(category);
    }

    @RequestMapping(value = "/getAllCategories", method = RequestMethod.GET)
    public List<Category> getAll() {
        return categoryService.getAllCategories();
    }

}
