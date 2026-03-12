/** Backend to display that the register had been successful in the front end viewing coolyo -Charles
 *
 */

package com.libratech.controller;

import com.libratech.model.User;
import com.libratech.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public  class RegisterController {
    private final UserService service;

    public RegisterController(UserService service){
        this.service = service;
    }

    @GetMapping("/register")
    public String page(Model model){
        model.addAttribute("user", new User());

        return "register";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute User user, Model model){

        String result = service.register(user);

        if(result.equals("success")) {
            model.addAttribute("success", "Registration successful");
            model.addAttribute("user", new User());
        }else{
            model.addAttribute("error", result);
        }
        return "register";
    }
}