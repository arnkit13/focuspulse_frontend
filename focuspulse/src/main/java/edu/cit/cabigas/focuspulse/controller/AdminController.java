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
        
        user.setLastActiveAt(java.time.OffsetDateTime.now());
        userRepository.save(user);
        
        return user;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestHeader("Authorization") String token) {
        getAdminFromToken(token);
        
        long totalUsers = userRepository.count();
        // Calculate real online sessions based on users active in the last hour
        long onlineSessions = userRepository.countByLastActiveAtAfter(java.time.OffsetDateTime.now().minusHours(1));
        
        // Calculate real system uptime
        long uptimeMillis = java.lang.management.ManagementFactory.getRuntimeMXBean().getUptime();
        long uptimeSeconds = uptimeMillis / 1000;
        long hours = uptimeSeconds / 3600;
        long minutes = (uptimeSeconds % 3600) / 60;
        String systemUptime = String.format("%dh %dm", hours, minutes);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("onlineSessions", onlineSessions);
        stats.put("systemUptime", systemUptime);
        
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
            // Status logic: if it's admin, mark as Admin, otherwise Online/Offline
            String status = "Offline";
            if ("ADMIN".equals(u.getRole())) {
                status = "Admin";
            } else if (u.getLastActiveAt() != null) {
                if (u.getLastActiveAt().isAfter(java.time.OffsetDateTime.now().minusHours(1))) {
                    status = "Online";
                }
            }
            map.put("status", status);
            map.put("joinedAt", u.getCreatedAt());
            map.put("lastActiveAt", u.getLastActiveAt());
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(userList);
    }
}
