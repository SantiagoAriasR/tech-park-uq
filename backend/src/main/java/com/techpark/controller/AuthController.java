package com.techpark.controller;

import com.techpark.model.Usuario;
import com.techpark.service.AuthService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/login
    // Body: { "email": "carlos@email.com", "contrasena": "1234" }
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String contrasena = body.get("contrasena");

        Usuario usuario = authService.autenticar(email, contrasena);

        if (usuario != null) {
            return Map.of(
                "exito", true,
                "id", usuario.getId(),
                "nombre", usuario.getNombre(),
                "email", usuario.getEmail(),
                "rol", usuario.getTipoUsuario(),
                "documento", usuario.getDocumento()
            );
        }

        return Map.of(
            "exito", false,
            "mensaje", "Email o contraseña incorrectos"
        );
    }
}
