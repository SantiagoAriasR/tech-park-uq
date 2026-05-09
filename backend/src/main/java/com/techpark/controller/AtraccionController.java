package com.techpark.controller;

import com.techpark.model.Atraccion;
import com.techpark.model.EstadoAtraccion;
import com.techpark.service.ParqueService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atracciones")
@CrossOrigin(origins = "http://localhost:5173") // permite peticiones desde React
public class AtraccionController {

    private final ParqueService parqueService;

    // Spring Boot inyecta el servicio automáticamente
    public AtraccionController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // GET /api/atracciones — listar todas en orden alfabético
    @GetMapping
    public List<Atraccion> listarTodas() {
        return parqueService.listarAtraccionesOrdenadas();
    }

    // GET /api/atracciones/{nombre} — buscar por nombre
    @GetMapping("/{nombre}")
    public Atraccion buscarPorNombre(@PathVariable String nombre) {
        return parqueService.buscarAtraccionPorNombre(nombre);
    }

    // PUT /api/atracciones/{nombre}/estado — cambiar estado
    // Body esperado: { "estado": "EN_MANTENIMIENTO" }
    @PutMapping("/{nombre}/estado")
    public Map<String, Object> cambiarEstado(@PathVariable String nombre,
                                              @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        boolean exito = parqueService.cambiarEstadoAtraccion(
            nombre, EstadoAtraccion.valueOf(nuevoEstado)
        );
        return Map.of(
            "exito", exito,
            "mensaje", exito ? "Estado actualizado correctamente" : "Atracción no encontrada"
        );
    }
}
