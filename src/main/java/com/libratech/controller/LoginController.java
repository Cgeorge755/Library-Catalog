/** Just added some imports for this to work with the application you can pretty much almost mirror
 * RegisterController for this - Charles: for Mariam/Muhammed
 * Also for the html portion look how the register html is laid out to get and Idea of how it would work
 *
 * ALSO little thing THIS TOOK ME SOO MUCH LONGER THAN I THOUGHT BUT IT WORKS for register anyway.
 */

package com.libratech.controller;

import com.libratech.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class LoginController {

    private final UserService service;

    public LoginController(UserService service){
        this.service = service;
    }

    @GetMapping("/login")
    public String showLoginPage(){
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String password,
                        Model model){

        String result = service.login (email,password);

        if (result.equals("success")){
            model.addAttribute("email",email);
            return "home";
        }

        model.addAttribute("error",result);
        return "login";
    }

}