package com.softlogic.dealer.application.webapp.rest;

import com.softlogic.dealer.application.webapp.entity.Incentive;
import com.softlogic.dealer.application.webapp.repository.IncentiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rest")
public class IncentiveController {

    @Autowired
    private IncentiveRepository incentiveRepository;

    public IncentiveController(IncentiveRepository incentiveRepository) {
        this.incentiveRepository = incentiveRepository;
    }

    @GetMapping(value = "add")
    public void addProduct(Incentive incentive) {
        incentiveRepository.save(incentive);
    }

    @GetMapping(value = "update")
    public void updateProduct(Incentive incentive) {
        incentiveRepository.save(incentive);
    }

    @GetMapping(value = "delete")
    public void deleteProduct(Incentive incentive) {
        incentiveRepository.delete(incentive);
    }

    @GetMapping(value = "all")
    public List<Incentive> getAll() {
        return incentiveRepository.findAll();
    }
}
