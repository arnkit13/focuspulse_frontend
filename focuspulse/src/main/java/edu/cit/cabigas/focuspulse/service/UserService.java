package edu.cit.cabigas.focuspulse.service;

import edu.cit.cabigas.focuspulse.dto.PasswordDTO;
import edu.cit.cabigas.focuspulse.dto.UserDTO;
import edu.cit.cabigas.focuspulse.entity.User;
import edu.cit.cabigas.focuspulse.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public UserDTO getUserProfile(String token) {
        String userEmail = extractEmailFromToken(token);
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setLastActiveAt(java.time.OffsetDateTime.now());
        userRepository.save(user);
        
        return new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getProfilePicture(), user.getRole());
    }

    // Update user profile (email, profile picture, first name, last name)
    public void updateUserProfile(String token, String email, MultipartFile profilePicture, String firstName, String lastName) {
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

        // Update first name and last name
        if (firstName != null && !firstName.trim().isEmpty()) {
            user.setFirstName(firstName);
        }
        if (lastName != null && !lastName.trim().isEmpty()) {
            user.setLastName(lastName);
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

    // Save profile picture to file system
    private String saveProfilePicture(MultipartFile file) {
        try {
            // Create uploads directory if it doesn't exist
            String uploadDir = "uploads/";
            java.io.File dir = new java.io.File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Save the file
            String fileName = "profile_" + System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_");
            java.nio.file.Path path = java.nio.file.Paths.get(uploadDir + fileName);
            java.nio.file.Files.copy(file.getInputStream(), path, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            // Return the full URL to access the image
            return "http://localhost:8081/uploads/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Error saving profile picture: " + e.getMessage());
        }
    }

    // Extract user email from JWT token
    private String extractEmailFromToken(String token) {
        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtService.extractEmail(token);
    }
}