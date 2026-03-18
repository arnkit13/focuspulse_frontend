package edu.cit.cabigas.focuspulse.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;  // User's email (unique)

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;  // Store password hash

    @Column(name = "first_name")
    private String firstName;  // User's first name

    @Column(name = "last_name")
    private String lastName;  // User's last name

    @Column(name = "profile_picture")
    private String profilePicture;  // Store profile picture URL or file path

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;  // Record creation time

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;  // Record last update time

    @PrePersist
    void onCreate() {
        createdAt = updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}