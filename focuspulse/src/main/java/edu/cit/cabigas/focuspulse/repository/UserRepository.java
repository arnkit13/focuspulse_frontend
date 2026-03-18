package edu.cit.cabigas.focuspulse.repository;

import edu.cit.cabigas.focuspulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Find user by email (returns Optional<User> to handle null cases)
    Optional<User> findByEmail(String email);
    
    // Check if a user exists by email
    boolean existsByEmail(String email);
    
    // Additional method to find user by first name or last name (optional)
    Optional<User> findByFirstNameAndLastName(String firstName, String lastName);
}