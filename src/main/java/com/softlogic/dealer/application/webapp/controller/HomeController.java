package com.softlogic.dealer.application.webapp.controller;

import com.softlogic.dealer.application.webapp.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/adminhome")
    public String adminHome(Model model) {
        model.addAttribute("msgs", messageRepository.findAll());
        return "adminhome";
    }

    @GetMapping("/userhome")
    public String userHome(Model model) {
        model.addAttribute("msgs", messageRepository.findAll());
        return "userhome";
    }

}
