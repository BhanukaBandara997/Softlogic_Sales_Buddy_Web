package com.softlogic.dealer.application.webapp.repository;

import com.softlogic.dealer.application.webapp.entity.Category;
import com.softlogic.dealer.application.webapp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findAllByOrderByIdAsc();

    List<Category> findAllByOrderByCategoryNameAsc();

    Category findByCategoryNameIgnoreCase(String category_name);

}
