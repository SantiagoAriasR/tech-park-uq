package com.techpark.controller;

import com.techpark.service.ParqueService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grafo")
@CrossOrigin(origins = "http://localhost:5173")
public class GrafoController {

    private final ParqueService parqueService;

    public GrafoController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // GET /api/grafo/estructura
    // Retorna todos los nodos y aristas para visualizar
    @GetMapping("/estructura")
    public Map<String, Object> getEstructura() {
        return parqueService.getEstructuraGrafo();
    }

    // GET /api/grafo/ruta?origen=Entrada Principal&destino=Splash Zone
    // Calcula la ruta óptima con Dijkstra
    @GetMapping("/ruta")
    public Map<String, Object> getRutaOptima(
            @RequestParam String origen,
            @RequestParam String destino) {
        return parqueService.calcularRutaOptima(origen, destino);
    }

    // GET /api/grafo/bfs?inicio=Entrada Principal
    // Recorrido BFS desde un nodo
    @GetMapping("/bfs")
    public Map<String, Object> getBFS(@RequestParam String inicio) {
        List<String> recorrido = parqueService.recorridoBFS(inicio);
        return Map.of(
                "inicio", inicio,
                "recorrido", recorrido,
                "totalNodos", recorrido.size());
    }

    // POST /api/grafo/conexion
    // Body: { "origen": "Montaña Rusa Extrema", "destino": "Columpio Extremo",
    // "distancia": 150 }
    @PostMapping("/conexion")
    public Map<String, Object> agregarConexion(@RequestBody Map<String, Object> body) {
        String origen = (String) body.get("origen");
        String destino = (String) body.get("destino");
        int distancia = (int) body.get("distancia");
        parqueService.getGrafoParque().agregarConexion(origen, destino, distancia);
        return Map.of(
                "exito", true,
                "mensaje", "Conexión agregada: " + origen + " ↔ " + destino);
    }

    // GET /api/grafo/nodos
    // Lista todos los nodos del grafo
    @GetMapping("/nodos")
    public Map<String, Object> getNodos() {
        return Map.of("nodos", parqueService.getGrafoParque().getNodos());
    }
}
