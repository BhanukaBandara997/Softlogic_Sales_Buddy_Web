package com.softlogic.dealer.application.webapp.repository;

import com.softlogic.dealer.application.webapp.entity.Invoice;
import com.softlogic.dealer.application.webapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    List<Invoice> findByUserId(Integer userId);

    List<Invoice> findByUserIdOrderByProducts_Category_CategoryName(Integer userId);

}
