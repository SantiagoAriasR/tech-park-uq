package com.techpark.controller;

import com.techpark.service.ParqueService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/operadores")
@CrossOrigin(origins = "http://localhost:5173")
public class OperadorAdminController {

    private final ParqueService parqueService;

    public OperadorAdminController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // GET /api/admin/operadores
    @GetMapping
    public List<Map<String, Object>> listar() {
        return parqueService.listarOperadores();
    }

    // POST /api/admin/operadores
    @PostMapping
    public Map<String, Object> crear(@RequestBody Map<String, Object> body) {
        String id = "O-" + System.currentTimeMillis();
        boolean exito = parqueService.crearOperador(
            id,
            (String) body.get("nombre"),
            (String) body.get("documento"),
            (String) body.get("email"),
            (String) body.get("contrasena"),
            (String) body.get("zonaAsignada")
        );
        return Map.of(
            "exito", exito,
            "mensaje", exito
                ? "Operador creado correctamente"
                : "Ya existe un operador con ese documento"
        );
    }

    // PUT /api/admin/operadores/{documento}
    @PutMapping("/{documento}")
    public Map<String, Object> actualizar(
            @PathVariable String documento,
            @RequestBody Map<String, Object> body) {
        boolean exito = parqueService.actualizarOperador(
            documento,
            (String) body.get("nombre"),
            (String) body.get("email"),
            (String) body.get("zonaAsignada")
        );
        return Map.of(
            "exito", exito,
            "mensaje", exito ? "Operador actualizado" : "Operador no encontrado"
        );
    }

    // DELETE /api/admin/operadores/{documento}
    @DeleteMapping("/{documento}")
    public Map<String, Object> eliminar(@PathVariable String documento) {
        boolean exito = parqueService.eliminarOperador(documento);
        return Map.of(
            "exito", exito,
            "mensaje", exito ? "Operador eliminado" : "Operador no encontrado"
        );
    }
}
