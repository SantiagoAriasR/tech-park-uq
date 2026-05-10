package com.techpark.controller;

import com.techpark.model.*;
import com.techpark.estructuras.*;
import com.techpark.service.ParqueService;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/operador")
@CrossOrigin(origins = "http://localhost:5173")
public class OperadorController {

    private final ParqueService parqueService;

    public OperadorController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // GET /api/operador/{documento}/atraccion
    // Obtener la atracción asignada al operador
    @GetMapping("/{documento}/atraccion")
    public Map<String, Object> getAtraccionAsignada(@PathVariable String documento) {
        Operador operador = parqueService.buscarOperador(documento);
        if (operador == null) {
            return Map.of("exito", false, "mensaje", "Operador no encontrado");
        }
        Zona zona = parqueService.buscarZona(operador.getZonaAsignada());
        if (zona == null) {
            return Map.of("exito", false, "mensaje", "Zona no encontrada");
        }
        List<Map<String, Object>> atracciones = new ArrayList<>();
        for (Atraccion a : zona.getAtracciones()) {
            atracciones.add(Map.of(
                    "nombre", a.getNombre(),
                    "tipo", a.getTipo(),
                    "estado", a.getEstado().toString(),
                    "capacidad", a.getCapacidad(),
                    "alturaMinima", a.getAlturaMinima(),
                    "edadMinima", a.getEdadMinima()));
        }
        return Map.of(
                "exito", true,
                "zona", operador.getZonaAsignada(),
                "atracciones", atracciones);
    }

    // GET /api/operador/cola/{atraccion}
    // Ver la cola de una atracción con detalle de tickets
    @GetMapping("/cola/{atraccion}")
    public Map<String, Object> getColaDetallada(@PathVariable String atraccion) {
        ColaPrioridad cola = parqueService.obtenerColaDeAtraccion(atraccion);
        return Map.of(
                "atraccion", atraccion,
                "personasEnCola", cola.getTamanio(),
                "proximoEnEntrar", cola.estaVacia()
                        ? "Cola vacía"
                        : cola.verPrimero().getVisitante().getNombre() +
                                " (" + cola.verPrimero().getClass().getSimpleName() + ")");
    }

    // POST /api/operador/validar-acceso
    // Validar si un visitante puede entrar a una atracción
    // Body: { "documento": "123456", "atraccion": "Montaña Rusa Extrema" }
    @PostMapping("/validar-acceso")
    public Map<String, Object> validarAcceso(@RequestBody Map<String, String> body) {
        String documento = body.get("documento");
        String nombreAtraccion = body.get("atraccion");

        Visitante visitante = parqueService.buscarVisitante(documento);
        if (visitante == null) {
            return Map.of("exito", false, "mensaje", "Visitante no encontrado");
        }

        Atraccion atraccion = parqueService.buscarAtraccionPorNombre(nombreAtraccion);
        if (atraccion == null) {
            return Map.of("exito", false, "mensaje", "Atracción no encontrada");
        }

        if (!atraccion.estaDisponible()) {
            return Map.of("exito", false, "mensaje", "La atracción no está disponible");
        }

        if (!atraccion.visitanteCumpleRequisitos(visitante)) {
            return Map.of(
                    "exito", false,
                    "mensaje", "El visitante no cumple los requisitos. " +
                            "Altura mínima: " + atraccion.getAlturaMinima() + "m | " +
                            "Edad mínima: " + atraccion.getEdadMinima() + " años");
        }

        return Map.of(
                "exito", true,
                "mensaje", "✅ Acceso autorizado",
                "visitante", visitante.getNombre(),
                "atraccion", nombreAtraccion);
    }

    // PUT /api/operador/atraccion/{nombre}/estado
    // Cambiar estado de atracción (solo operador de esa zona)
    @PutMapping("/atraccion/{nombre}/estado")
    public Map<String, Object> cambiarEstado(
            @PathVariable String nombre,
            @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        String motivo = body.get("motivo");

        boolean exito = parqueService.cambiarEstadoAtraccion(
                nombre, EstadoAtraccion.valueOf(nuevoEstado));

        if (exito) {
            return Map.of(
                    "exito", true,
                    "mensaje", "Estado actualizado a " + nuevoEstado +
                            (motivo != null ? " | Motivo: " + motivo : ""));
        }
        return Map.of("exito", false, "mensaje", "Atracción no encontrada");
    }
}
