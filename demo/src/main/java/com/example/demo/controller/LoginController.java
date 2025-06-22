package com.example.demo.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

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


    @GetMapping("/sample")
    public String sample(Model model, HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        model.addAttribute("_csrf", csrfToken);
        return "sample"; // sample.html
    }


    @ModelAttribute
    public void addCsrfToken(Model model, HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        if (csrfToken != null) {
            model.addAttribute("_csrf", csrfToken);
        }
//
    }
    @GetMapping("/build_your_own")
    public String buildYourOwn(Model model, HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        model.addAttribute("_csrf", csrfToken);
        return "build_your_own";
    }
}

//public class BuildController {
//
//    @GetMapping("/sample")
//    public String sample() {
//        return "sample"; // Make sure sample.html exists in `src/main/resources/templates/`
//    }
//}
