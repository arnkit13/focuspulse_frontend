package edu.cit.cabigas.focuspulse.controller;

import edu.cit.cabigas.focuspulse.dto.AuthResponse;
import edu.cit.cabigas.focuspulse.dto.LoginRequest;
import edu.cit.cabigas.focuspulse.dto.RegisterRequest;
import edu.cit.cabigas.focuspulse.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
