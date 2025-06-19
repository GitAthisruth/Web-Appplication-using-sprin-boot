package com.example.demo.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {
    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @GetMapping("/main")
    public String showWelcome() {
        return "main";
    }

    @GetMapping("/models")
    public String showModelsPage() {
        return "models";
    }

    @GetMapping("/models/octa")
    public String showOctaPage() {
        return "models/octa";
    }

    @GetMapping("/models/130")
    public String show130Page() {
        return "models/130";
    }

    @GetMapping("/models/110")
    public String show110Page() {
        return "models/110";
    }

    @GetMapping("/models/90")
    public String show90Page() {
        return "models/90";
    }

    @GetMapping("/build_your_own")
    public String build_your_own() {
        return "build_your_own";
    }

    @GetMapping("/sample")
    public String sample() {
        return "sample";
    }

}

