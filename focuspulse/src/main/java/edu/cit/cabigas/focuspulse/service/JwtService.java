package edu.cit.cabigas.focuspulse.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    public String generateToken(String email, Long userId) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(signingKey())
                .compact();
    }

    public String extractEmail(String token) {
        String cleanToken = normalizeToken(token);
        if (cleanToken == null || cleanToken.isBlank()) {
            throw new IllegalArgumentException("JWT token is missing or empty");
        }
        return getClaims(cleanToken).getSubject();
    }

    public boolean isValid(String token) {
        try {
            String cleanToken = normalizeToken(token);
            if (cleanToken == null || cleanToken.isBlank()) {
                return false;
            }
            getClaims(cleanToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        SecretKey key = signingKey();
        Jws<Claims> jws = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
        return jws.getPayload();
    }

    private String normalizeToken(String token) {
        if (token == null) {
            return null;
        }
        return token.replaceFirst("^Bearer ", "").trim();
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}
