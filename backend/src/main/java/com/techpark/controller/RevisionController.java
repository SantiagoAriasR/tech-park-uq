package com.techpark.controller;

import com.techpark.service.ParqueService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/revisiones")
@CrossOrigin(origins = "http://localhost:5173")
public class RevisionController {

    private final ParqueService parqueService;

    public RevisionController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // GET /api/revisiones — todas las revisiones
    @GetMapping
    public List<Map<String, Object>> getRevisiones() {
        return parqueService.getRevisiones();
    }

    // GET /api/revisiones/{atraccion} — revisiones de una atracción
    @GetMapping("/{atraccion}")
    public List<Map<String, Object>> getRevisionesPorAtraccion(
            @PathVariable String atraccion) {
        return parqueService.getRevisionesPorAtraccion(atraccion);
    }

    // POST /api/revisiones — registrar nueva revisión
    // Body: { "atraccion": "Montaña Rusa Extrema", "documento": "111111",
    //         "resultado": "APROBADA", "observaciones": "Todo en orden" }
    @PostMapping
    public Map<String, Object> registrarRevision(@RequestBody Map<String, String> body) {
        boolean exito = parqueService.registrarRevision(
            body.get("atraccion"),
            body.get("documento"),
            body.get("resultado"),
            body.get("observaciones")
        );
        return Map.of(
            "exito", exito,
            "mensaje", exito
                ? "Revisión registrada correctamente"
                : "No se pudo registrar. Verifica atracción y operador"
        );
    }
}
