package com.softlogic.dealer.application.webapp.repository;

import com.softlogic.dealer.application.webapp.entity.Category;
import com.softlogic.dealer.application.webapp.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findAllByOrderByCategoryAsc();

    Product findByProductNameIgnoreCase(String product_name);

//    @EntityGraph(attributePaths = "invoice")
//    List<Product> findFirst10ByOrderByProductNameAsc();

    List<Product> findByCategory_CategoryName(String categoryName);

    Product findByProductSerialNo(String serialNo);

    void deleteInBulkByInvoiceId(int invoice);

    void deleteByInvoiceId(int invoice);

}
