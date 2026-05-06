package edu.cit.cabigas.focuspulse.service;

import edu.cit.cabigas.focuspulse.dto.AuthResponse;
import edu.cit.cabigas.focuspulse.dto.LoginRequest;
import edu.cit.cabigas.focuspulse.dto.RegisterRequest;
import edu.cit.cabigas.focuspulse.entity.User;
import edu.cit.cabigas.focuspulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            if (!request.getEmail().endsWith("@admin.com")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Admin email must end with @admin.com");
            }
            if (!"yonah".equals(request.getAdminCode())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid admin code");
            }
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }
        
        user.setLastActiveAt(java.time.OffsetDateTime.now());
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        user.setLastActiveAt(java.time.OffsetDateTime.now());
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole());
    }
}
