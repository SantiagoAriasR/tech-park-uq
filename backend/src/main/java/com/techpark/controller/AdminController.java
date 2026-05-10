package com.techpark.controller;

import com.techpark.model.AlertaClimatica;
import com.techpark.model.ReporteJornada;
import com.techpark.service.ParqueService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final ParqueService parqueService;

    public AdminController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // POST /api/admin/alerta-climatica
    // Body: { "tipo": "TORMENTA_ELECTRICA", "descripcion": "Tormenta eléctrica en
    // el área" }
    @PostMapping("/alerta-climatica")
    public Map<String, Object> activarAlerta(@RequestBody Map<String, String> body) {
        String tipo = body.get("tipo");
        AlertaClimatica.TipoAlerta tipoAlerta = AlertaClimatica.TipoAlerta.valueOf(tipo);
        String descripcion = body.get("descripcion");
        return parqueService.activarAlertaClimatica(tipoAlerta, descripcion);
    }

    // DELETE /api/admin/alerta-climatica
    @DeleteMapping("/alerta-climatica")
    public Map<String, Object> desactivarAlerta() {
        return parqueService.desactivarAlerta();
    }

    // GET /api/admin/alerta-climatica
    @GetMapping("/alerta-climatica")
    public Map<String, Object> getAlertaActual() {
        AlertaClimatica alerta = parqueService.getAlertaActual();
        if (alerta == null || !alerta.isActiva()) {
            return Map.of("activa", false, "mensaje", "No hay alerta activa");
        }
        return Map.of(
                "activa", true,
                "tipo", alerta.getTipo().toString(),
                "descripcion", alerta.getDescripcion(),
                "fechaHora", alerta.getFechaHora().toString());
    }

    // GET /api/admin/reporte
    @GetMapping("/reporte")
    public ReporteJornada getReporte() {
        return parqueService.generarReporte();
    }
}
