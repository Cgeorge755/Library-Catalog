/** This is where the User data is stored in the database it is keep by the username and or the email
 * that is provided by the user for the LibraTech admins to keep track - Charles
 *
 *  Login can be added in and extension to this if you use search by email/username to find the account
 *  - Charles: for Mariam/Muhammed
 */
package com.libratech.repository;

import com.libratech.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findByEmail(String email);
}
