package edu.cit.cabigas.focuspulse.controller;

import edu.cit.cabigas.focuspulse.dto.PasswordDTO;
import edu.cit.cabigas.focuspulse.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    // PUT: Update user profile (email and profile picture)
    @PutMapping
    public ResponseEntity<String> updateProfile(
            @RequestHeader("Authorization") String token,  
            @RequestParam("email") String email,  
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture  
    ) {
        try {
            // Call the service to update the profile (email and profile picture)
            userService.updateUserProfile(token, email, profilePicture);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            // Return an error response with the error message from the backend
            return ResponseEntity.status(500).body("Error updating profile: " + e.getMessage());
        }
    }

    // PUT: Update password
    @PutMapping("/password")
    public ResponseEntity<String> changePassword(@RequestHeader("Authorization") String token,
                                                 @Valid @RequestBody PasswordDTO passwordDTO) {
        try {
            // Call the service to change the password
            userService.changePassword(token, passwordDTO);
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            // Return an error response if password change fails
            return ResponseEntity.status(500).body("Error changing password: " + e.getMessage());
        }
    }
}