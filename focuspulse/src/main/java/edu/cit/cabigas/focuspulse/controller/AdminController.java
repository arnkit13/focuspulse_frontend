package edu.cit.cabigas.focuspulse.controller;

import edu.cit.cabigas.focuspulse.entity.User;
import edu.cit.cabigas.focuspulse.repository.UserRepository;
import edu.cit.cabigas.focuspulse.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private User getAdminFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        // Admin validation based on role
        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Unauthorized: Admin access required.");
        }
        return user;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestHeader("Authorization") String token) {
        getAdminFromToken(token);
        
        long totalUsers = userRepository.count();
        // Mocking online sessions for now, could be based on recently updated users in a real app
        long onlineSessions = (long) (Math.random() * (totalUsers > 0 ? totalUsers : 1)) + 1;
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("onlineSessions", onlineSessions);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers(@RequestHeader("Authorization") String token) {
        getAdminFromToken(token);
        
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userList = users.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", (u.getFirstName() != null ? u.getFirstName() : "") + " " + (u.getLastName() != null ? u.getLastName() : ""));
            map.put("email", u.getEmail());
            // Status logic: if it's admin, mark as Admin, otherwise Active
            map.put("status", "ADMIN".equals(u.getRole()) ? "Admin" : "Active");
            map.put("joinedAt", u.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(userList);
    }
}
