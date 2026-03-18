package edu.cit.cabigas.focuspulse.service;

import edu.cit.cabigas.focuspulse.dto.PasswordDTO;
import edu.cit.cabigas.focuspulse.entity.User;
import edu.cit.cabigas.focuspulse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Password encoder for hashing

    // Update user profile (email and profile picture)
    public void updateUserProfile(String token, String email, MultipartFile profilePicture) {
        String userEmail = extractEmailFromToken(token); // Get current user's email from token
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        // Update email if provided
        if (email != null && !email.isEmpty()) {
            user.setEmail(email);
        }

        // Handle profile picture update (save it and get the URL or path)
        if (profilePicture != null) {
            String profilePictureUrl = saveProfilePicture(profilePicture);  // Save file and get URL or path
            user.setProfilePicture(profilePictureUrl);  // Set the new profile picture URL
        }

        userRepository.save(user);  // Save the updated user in the database
    }

    // Change user password (hashed password)
    public void changePassword(String token, PasswordDTO passwordDTO) {
        String userEmail = extractEmailFromToken(token);  // Get email from token
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        // Verify the old password and set the new password
        if (passwordEncoder.matches(passwordDTO.getOldPassword(), user.getPasswordHash())) {
            user.setPasswordHash(passwordEncoder.encode(passwordDTO.getNewPassword()));  // Hash the new password and update it
            userRepository.save(user);  // Save the updated user in the database
        } else {
            throw new RuntimeException("Old password is incorrect");
        }
    }

    // Save profile picture to file system or cloud storage (e.g., AWS S3, Local Storage)
    private String saveProfilePicture(MultipartFile file) {
        try {
            // Implement your logic to save the image and return the URL or file path
            String filePath = "path/to/saved/image.jpg";  // Example file path (you should save the file to a directory or cloud storage)
            return filePath;
        } catch (Exception e) {
            throw new RuntimeException("Error saving profile picture: " + e.getMessage());
        }
    }

    // Extract user email from JWT token
    private String extractEmailFromToken(String token) {
        // This should decode the JWT and extract the email, for now it's a placeholder
        return "user@example.com"; // Replace with actual JWT decoding logic
    }
}