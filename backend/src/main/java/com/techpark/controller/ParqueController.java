package com.techpark.controller;

import com.techpark.model.Zona;
import com.techpark.service.ParqueService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parque")
@CrossOrigin(origins = "http://localhost:5173")
public class ParqueController {

    private final ParqueService parqueService;

    public ParqueController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // GET /api/parque/info — información general del parque
    @GetMapping("/info")
    public Map<String, Object> getInfo() {
        return Map.of(
            "nombre", parqueService.getParque().getNombre(),
            "capacidadMax", parqueService.getParque().getCapacidadMax(),
            "visitantesActuales", parqueService.getVisitantesActuales(),
            "tieneCapacidad", parqueService.tieneCapacidad(),
            "totalZonas", parqueService.listarZonas().size()
        );
    }

    // GET /api/parque/zonas — listar todas las zonas
    @GetMapping("/zonas")
    public List<Zona> getZonas() {
        return parqueService.listarZonas();
    }
}
