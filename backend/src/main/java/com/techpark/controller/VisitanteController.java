package com.techpark.controller;

import com.techpark.model.Visitante;
import com.techpark.service.ParqueService;
import com.techpark.estructuras.Nodo;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.techpark.estructuras.Nodo;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/visitantes")
@CrossOrigin(origins = "http://localhost:5173")
public class VisitanteController {

    private final ParqueService parqueService;

    public VisitanteController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // GET /api/visitantes/{documento}/historial
    @GetMapping("/{documento}/historial")
    public Map<String, Object> getHistorial(@PathVariable String documento) {
        Visitante visitante = parqueService.buscarVisitante(documento);
        if (visitante == null) {
            return Map.of("exito", false, "mensaje", "Visitante no encontrado");
        }
        List<String> historial = new ArrayList<>();
        Nodo<String> actual = visitante.getHistorialVisitas().getCabeza();
        while (actual != null) {
            historial.add(actual.dato);
            actual = actual.siguiente;
        }
        return Map.of("exito", true, "historial", historial);
    }

    // GET /api/visitantes/{documento}/favoritos
    @GetMapping("/{documento}/favoritos")
    public Map<String, Object> getFavoritos(@PathVariable String documento) {
        Visitante visitante = parqueService.buscarVisitante(documento);
        if (visitante == null) {
            return Map.of("exito", false, "mensaje", "Visitante no encontrado");
        }
        return Map.of("exito", true, "favoritos", visitante.getFavoritos().aLista());
    }

    // POST /api/visitantes/{documento}/favoritos
    // Body: { "atraccion": "Montaña Rusa Extrema" }
    @PostMapping("/{documento}/favoritos")
    public Map<String, Object> agregarFavorito(@PathVariable String documento,
            @RequestBody Map<String, String> body) {
        Visitante visitante = parqueService.buscarVisitante(documento);
        if (visitante == null) {
            return Map.of("exito", false, "mensaje", "Visitante no encontrado");
        }
        boolean agregado = visitante.agregarFavorito(body.get("atraccion"));
        return Map.of(
                "exito", agregado,
                "mensaje", agregado ? "Agregado a favoritos" : "Ya estaba en favoritos");
    }

    // DELETE /api/visitantes/{documento}/favoritos/{atraccion}
    @DeleteMapping("/{documento}/favoritos/{atraccion}")
    public Map<String, Object> eliminarFavorito(@PathVariable String documento,
            @PathVariable String atraccion) {
        Visitante visitante = parqueService.buscarVisitante(documento);
        if (visitante == null) {
            return Map.of("exito", false, "mensaje", "Visitante no encontrado");
        }
        boolean eliminado = visitante.eliminarFavorito(atraccion);
        return Map.of(
                "exito", eliminado,
                "mensaje", eliminado ? "Eliminado de favoritos" : "No estaba en favoritos");
    }

    // GET /api/visitantes — listar todos los visitantes registrados
    @GetMapping
    public List<Visitante> listarTodos() {
        List<Visitante> lista = new ArrayList<>();
        Nodo<Visitante> actual = parqueService.getListaVisitantes().getCabeza();
        while (actual != null) {
            lista.add(actual.dato);
            actual = actual.siguiente;
        }
        return lista;
    }

    // GET /api/visitantes/{documento} — buscar por documento
    @GetMapping("/{documento}")
    public Map<String, Object> buscarPorDocumento(@PathVariable String documento) {
        Visitante visitante = parqueService.buscarVisitante(documento);
        if (visitante != null) {
            return Map.of("encontrado", true, "visitante", visitante);
        }
        return Map.of("encontrado", false, "mensaje", "Visitante no encontrado");
    }

    // POST /api/visitantes — registrar nuevo visitante
    @PostMapping
    public Map<String, Object> registrar(@RequestBody Visitante visitante) {
        boolean exito = parqueService.registrarVisitante(visitante);
        return Map.of(
                "exito", exito,
                "mensaje", exito ? "Visitante registrado correctamente" : "Parque lleno o error en el registro");
    }
}
