package com.techpark.controller;

import com.techpark.model.Zona;
import com.techpark.service.ParqueService;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zonas")
@CrossOrigin(origins = "http://localhost:5173")
public class ZonaController {

    private final ParqueService parqueService;

    public ZonaController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // GET /api/zonas — listar todas las zonas con detalle
    @GetMapping
    public List<Map<String, Object>> listarZonas() {
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Zona zona : parqueService.listarZonas()) {
            resultado.add(Map.of(
                    "id", zona.getId(),
                    "nombre", zona.getNombre(),
                    "capacidadMax", zona.getCapacidadMax(),
                    "totalAtracciones", zona.getAtracciones().size(),
                    "atraccionesActivas", zona.contarAtraccionesActivas(),
                    "totalOperadores", zona.getOperadores().size()));
        }
        return resultado;
    }

    // GET /api/zonas/{nombre} — detalle de una zona
    @GetMapping("/{nombre}")
    public Map<String, Object> getZona(@PathVariable String nombre) {
        return parqueService.getDetalleZona(nombre);
    }

    // POST /api/zonas — crear nueva zona
    // Body: { "id": "Z3", "nombre": "Zona Infantil", "capacidadMax": 60 }
    @PostMapping
    public Map<String, Object> crearZona(@RequestBody Map<String, Object> body) {
        String id = (String) body.get("id");
        String nombre = (String) body.get("nombre");
        int capacidadMax = (int) body.get("capacidadMax");

        boolean exito = parqueService.crearZona(id, nombre, capacidadMax);
        return Map.of(
                "exito", exito,
                "mensaje", exito
                        ? "Zona creada correctamente"
                        : "Ya existe una zona con ese nombre");
    }

    // POST /api/zonas/{nombre}/atracciones
    // Body: { "atraccion": "Montaña Rusa Extrema" }
    @PostMapping("/{nombre}/atracciones")
    public Map<String, Object> asignarAtraccion(
            @PathVariable String nombre,
            @RequestBody Map<String, String> body) {
        boolean exito = parqueService.asignarAtraccionAZona(
                body.get("atraccion"), nombre);
        return Map.of(
                "exito", exito,
                "mensaje", exito
                        ? "Atracción asignada correctamente"
                        : "No se pudo asignar. Verifica que existan la atracción y la zona");
    }

    // POST /api/zonas/{nombre}/operadores
    // Body: { "documento": "111111" }
    @PostMapping("/{nombre}/operadores")
    public Map<String, Object> asignarOperador(
            @PathVariable String nombre,
            @RequestBody Map<String, String> body) {
        boolean exito = parqueService.asignarOperadorAZona(
                body.get("documento"), nombre);
        return Map.of(
                "exito", exito,
                "mensaje", exito
                        ? "Operador asignado correctamente"
                        : "No se pudo asignar. Verifica que existan el operador y la zona");
    }

    // PUT /api/zonas/{nombre} — actualizar zona
    // Body: { "nuevoNombre": "Zona Aventura Extrema", "capacidadMax": 120 }
    @PutMapping("/{nombre}")
    public Map<String, Object> actualizarZona(
            @PathVariable String nombre,
            @RequestBody Map<String, Object> body) {
        String nuevoNombre = (String) body.get("nuevoNombre");
        int capacidadMax = (int) body.get("capacidadMax");

        boolean exito = parqueService.actualizarZona(nombre, nuevoNombre, capacidadMax);
        return Map.of(
                "exito", exito,
                "mensaje", exito ? "Zona actualizada correctamente" : "Zona no encontrada");
    }

    // DELETE /api/zonas/{nombre} — eliminar zona
    @DeleteMapping("/{nombre}")
    public Map<String, Object> eliminarZona(@PathVariable String nombre) {
        boolean exito = parqueService.eliminarZona(nombre);
        return Map.of(
                "exito", exito,
                "mensaje", exito ? "Zona eliminada correctamente" : "Zona no encontrada");
    }
}
