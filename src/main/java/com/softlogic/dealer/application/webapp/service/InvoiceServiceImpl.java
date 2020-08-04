package com.softlogic.dealer.application.webapp.service;

import com.softlogic.dealer.application.webapp.entity.Invoice;
import com.softlogic.dealer.application.webapp.entity.User;
import com.softlogic.dealer.application.webapp.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    InvoiceRepository invoiceRepository;

    @Override
    public void save(Invoice invoice) {
        invoice.setInvoiceImagePath(invoice.getInvoiceImagePath());
        invoice.setUser(invoice.getUser());
        invoiceRepository.save(invoice);
    }

    @Override
    public List<Invoice> findByUserId(Integer userId) {
        return invoiceRepository.findByUserId(userId);
    }

    @Override
    public List<Invoice> findByUserIdOrderByProducts_Category_CategoryName(Integer userId) {
        return invoiceRepository.findByUserIdOrderByProducts_Category_CategoryName(userId);
    }

    @Override
    public void delete(Invoice invoice) {
        invoiceRepository.delete(invoice);
    }

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
}
