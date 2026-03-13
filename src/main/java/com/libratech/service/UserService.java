/** This is to check on the backend where the username and email exists in the database to save the user
 * that the account is linked to. - Charles ADD THINGS THIS IS BAREBONESSSS ;)
 *  When doing login you can extend this by making a new function to check if the email and password are correct
 *  to allow the login to occur - Charles: for Mariam/Muhammed
 */
package com.libratech.service;

import com.libratech.model.User;
import com.libratech.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo){
        this.repo = repo;
    }

    public  String register(User user){
        if(user.getFullName() == null || user.getFullName().isBlank() || user.getUsername() == null ||
        user.getUsername().isBlank() || user.getEmail() == null || user.getEmail().isBlank() || user.getPassword() == null
        || user.getPassword().isBlank()) {
            return "Please fill in all fields";
        }

        if (repo.existsByUsername(user.getUsername()))
            return "Username already exists";

        if (repo.existsByEmail(user.getEmail()))
            return "Email already exists";

        repo.save(user);

        return "success";

    }
    public String login(String email, String password){
        User user = repo.findByEmail(email);

        if (user == null){
            return "Email was not found";
        }

        if (!user.getPassword().equals(password)){
            return "Incorrect Password";
        }
        return "success";
    }
}