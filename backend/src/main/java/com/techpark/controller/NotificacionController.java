package com.techpark.controller;

import com.techpark.service.ParqueService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificacionController {

    private final ParqueService parqueService;

    public NotificacionController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // GET /api/notificaciones/{documento}
    @GetMapping("/{documento}")
    public List<Map<String, Object>> getNotificaciones(
            @PathVariable String documento) {
        return parqueService.getNotificacionesVisitante(documento);
    }

    // GET /api/notificaciones/{documento}/count
    @GetMapping("/{documento}/count")
    public Map<String, Object> contarNoLeidas(@PathVariable String documento) {
        return Map.of(
            "noLeidas", parqueService.contarNotificacionesNoLeidas(documento)
        );
    }

    // PUT /api/notificaciones/{id}/leer
    @PutMapping("/{id}/leer")
    public Map<String, Object> marcarLeida(@PathVariable String id) {
        boolean exito = parqueService.marcarNotificacionLeida(id);
        return Map.of(
            "exito", exito,
            "mensaje", exito ? "Notificación marcada como leída" : "No encontrada"
        );
    }
}
