package com.aistudyassistant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping("/")
    public String index() {
        return "redirect:/frontend/index-new.html";
    }

    @GetMapping("/landing")
    public String landing() {
        return "redirect:/frontend/index-new.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "redirect:/frontend/dashboard-new.html";
    }
}
