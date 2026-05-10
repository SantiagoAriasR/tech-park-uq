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

    // POST /api/atracciones — crear nueva atracción
    @PostMapping
    public Map<String, Object> crearAtraccion(@RequestBody Map<String, Object> body) {
        String tipo = (String) body.get("tipo");
        String id = "A-" + System.currentTimeMillis();
        String nombre = (String) body.get("nombre");
        int capacidad = (int) body.get("capacidad");
        double alturaMinima = ((Number) body.get("alturaMinima")).doubleValue();
        int edadMinima = (int) body.get("edadMinima");
        double costoExtra = ((Number) body.get("costoExtra")).doubleValue();
        String nombreZona = (String) body.get("zona");

        boolean exito;
        if ("MECANICA".equals(tipo)) {
            double velocidadMax = ((Number) body.get("velocidadMax")).doubleValue();
            exito = parqueService.crearAtraccionMecanica(
                    id, nombre, capacidad, alturaMinima,
                    edadMinima, costoExtra, velocidadMax, nombreZona);
        } else {
            double profundidad = ((Number) body.get("profundidad")).doubleValue();
            exito = parqueService.crearAtraccionAcuatica(
                    id, nombre, capacidad, alturaMinima,
                    edadMinima, costoExtra, profundidad, nombreZona);
        }

        return Map.of(
                "exito", exito,
                "mensaje", exito
                        ? "Atracción creada correctamente"
                        : "Ya existe una atracción con ese nombre");
    }

    // PUT /api/atracciones/{nombre}/datos — actualizar datos de atracción
    @PutMapping("/{nombre}/datos")
    public Map<String, Object> actualizarAtraccion(
            @PathVariable String nombre,
            @RequestBody Map<String, Object> body) {
        int capacidad = (int) body.get("capacidad");
        double alturaMinima = ((Number) body.get("alturaMinima")).doubleValue();
        int edadMinima = (int) body.get("edadMinima");
        double costoExtra = ((Number) body.get("costoExtra")).doubleValue();

        boolean exito = parqueService.actualizarAtraccion(
                nombre, capacidad, alturaMinima, edadMinima, costoExtra);
        return Map.of(
                "exito", exito,
                "mensaje", exito ? "Atracción actualizada" : "Atracción no encontrada");
    }

    // DELETE /api/atracciones/{nombre} — eliminar atracción
    @DeleteMapping("/{nombre}")
    public Map<String, Object> eliminarAtraccion(@PathVariable String nombre) {
        boolean exito = parqueService.eliminarAtraccion(nombre);
        return Map.of(
                "exito", exito,
                "mensaje", exito ? "Atracción eliminada" : "Atracción no encontrada");
    }

    // PUT /api/atracciones/{nombre}/estado — cambiar estado
    // Body esperado: { "estado": "EN_MANTENIMIENTO" }
    @PutMapping("/{nombre}/estado")
    public Map<String, Object> cambiarEstado(@PathVariable String nombre,
            @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        boolean exito = parqueService.cambiarEstadoAtraccion(
                nombre, EstadoAtraccion.valueOf(nuevoEstado));
        return Map.of(
                "exito", exito,
                "mensaje", exito ? "Estado actualizado correctamente" : "Atracción no encontrada");
    }
}
