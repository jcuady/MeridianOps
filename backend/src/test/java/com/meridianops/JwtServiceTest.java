package com.meridianops;

import com.meridianops.security.JwtService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    @Test
    void generateAndValidateToken() {
        JwtService jwtService = new JwtService(
                "change-me-to-a-long-random-secret-at-least-32-chars",
                3_600_000L);

        String token = jwtService.generateToken("ops", "USER");

        assertTrue(jwtService.isValid(token));
        assertEquals("ops", jwtService.extractUsername(token));
        assertEquals("USER", jwtService.extractRole(token));
        assertFalse(jwtService.isValid("not-a-token"));
    }
}
