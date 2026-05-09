package com.techpark.controller;

import com.techpark.model.Visitante;
import com.techpark.service.ParqueService;
import com.techpark.estructuras.Nodo;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visitantes")
@CrossOrigin(origins = "http://localhost:5173")
public class VisitanteController {

    private final ParqueService parqueService;

    public VisitanteController(ParqueService parqueService) {
        this.parqueService = parqueService;
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
            "mensaje", exito ? "Visitante registrado correctamente" : "Parque lleno o error en el registro"
        );
    }
}
