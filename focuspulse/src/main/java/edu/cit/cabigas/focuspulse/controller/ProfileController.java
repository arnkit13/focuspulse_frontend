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

    // GET: Fetch user profile data
    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            return ResponseEntity.ok(userService.getUserProfile(token));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching profile: " + e.getMessage());
        }
    }

    // POST: Update user profile (email and profile picture) - POST is required for multipart/form-data
    @PostMapping
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture
    ) {
        try {
            // Call the service to update the profile
            userService.updateUserProfile(token, email, profilePicture, firstName, lastName);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Profile updated successfully"));
        } catch (Exception e) {
            // Return an error response with the error message from the backend
            return ResponseEntity.status(500).body(java.util.Collections.singletonMap("message", "Error updating profile: " + e.getMessage()));
        }
    }

    // PUT: Update password
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token,
                                                 @Valid @RequestBody PasswordDTO passwordDTO) {
        try {
            // Call the service to change the password
            userService.changePassword(token, passwordDTO);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Password updated successfully"));
        } catch (Exception e) {
            // Return an error response if password change fails
            return ResponseEntity.status(500).body(java.util.Collections.singletonMap("message", "Error changing password: " + e.getMessage()));
        }
    }
}