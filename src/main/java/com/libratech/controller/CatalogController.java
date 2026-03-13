package com.libratech.controller;

import com.libratech.service.BookService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class CatalogController {

    private final BookService service;

    public CatalogController(BookService service) {
        this.service = service;
    }

    @GetMapping("/catalog")
    public String showCatalog(@RequestParam(required = false) String keyword, Model model) {
        model.addAttribute("books", service.searchBooks(keyword));
        model.addAttribute("keyword", keyword);
        return "catalog";
    }
}