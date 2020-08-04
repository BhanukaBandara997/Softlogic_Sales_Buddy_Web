package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Invoice;
import com.softlogic.dealer.application.webapp.entity.User;

import java.util.List;

public interface InvoiceService {

    void save(Invoice invoice);

    List<Invoice> findByUserId(Integer userId);

    List<Invoice> findByUserIdOrderByProducts_Category_CategoryName(Integer userId);

    void delete(Invoice invoice);

    List<Invoice> getAllInvoices();
}
