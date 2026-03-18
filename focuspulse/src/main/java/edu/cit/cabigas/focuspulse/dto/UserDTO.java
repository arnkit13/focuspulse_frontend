package edu.cit.cabigas.focuspulse.dto;

public class UserDTO {
    private String email;
    private String profilePicture;

    public UserDTO(String email, String profilePicture) {
        this.email = email;
        this.profilePicture = profilePicture;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}