package com.aistudyassistant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "forward:/frontend/index-new.html";
    }
    
    @GetMapping("/home")
    public String home() {
        return "forward:/frontend/index-new.html";
    }
}
