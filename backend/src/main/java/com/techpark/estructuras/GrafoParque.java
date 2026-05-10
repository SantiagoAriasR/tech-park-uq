package com.techpark.estructuras;

import java.util.*;

public class GrafoParque {

    // Lista de adyacencia: cada atracción tiene una lista de senderos
    private Map<String, List<Sendero>> adyacencia;

    public GrafoParque() {
        this.adyacencia = new HashMap<>();
    }

    // Agregar una atracción como nodo del grafo
    public void agregarNodo(String nombreAtraccion) {
        adyacencia.putIfAbsent(nombreAtraccion, new ArrayList<>());
    }

    // Agregar conexión bidireccional entre dos atracciones
    public void agregarConexion(String origen, String destino, int distancia) {
        adyacencia.putIfAbsent(origen, new ArrayList<>());
        adyacencia.putIfAbsent(destino, new ArrayList<>());
        adyacencia.get(origen).add(new Sendero(destino, distancia));
        adyacencia.get(destino).add(new Sendero(origen, distancia));
    }

    // Obtener todos los nodos del grafo
    public Set<String> getNodos() {
        return adyacencia.keySet();
    }

    // Obtener conexiones de un nodo
    public List<Sendero> getConexiones(String nodo) {
        return adyacencia.getOrDefault(nodo, new ArrayList<>());
    }

    // ─────────────────────────────────────────
    // ALGORITMO DE DIJKSTRA
    // Encuentra la ruta más corta entre dos atracciones
    // ─────────────────────────────────────────
    public Map<String, Object> dijkstra(String origen, String destino) {
        // Distancias mínimas conocidas desde el origen
        Map<String, Integer> distancias = new HashMap<>();
        // Nodo anterior en la ruta óptima
        Map<String, String> anteriores = new HashMap<>();
        // Nodos por visitar ordenados por distancia
        PriorityQueue<String> porVisitar = new PriorityQueue<>(
            Comparator.comparingInt(n -> distancias.getOrDefault(n, Integer.MAX_VALUE))
        );

        // Inicializar todas las distancias como infinito
        for (String nodo : adyacencia.keySet()) {
            distancias.put(nodo, Integer.MAX_VALUE);
            anteriores.put(nodo, null);
        }

        // La distancia al origen es 0
        distancias.put(origen, 0);
        porVisitar.add(origen);

        while (!porVisitar.isEmpty()) {
            String actual = porVisitar.poll();

            // Si llegamos al destino, reconstruimos la ruta
            if (actual.equals(destino)) break;

            for (Sendero sendero : getConexiones(actual)) {
                int nuevaDistancia = distancias.get(actual) + sendero.getDistancia();

                if (nuevaDistancia < distancias.getOrDefault(
                        sendero.getDestino(), Integer.MAX_VALUE)) {
                    distancias.put(sendero.getDestino(), nuevaDistancia);
                    anteriores.put(sendero.getDestino(), actual);
                    porVisitar.add(sendero.getDestino());
                }
            }
        }

        // Reconstruir la ruta desde destino hasta origen
        List<String> ruta = new ArrayList<>();
        String paso = destino;
        while (paso != null) {
            ruta.add(0, paso); // agrega al inicio
            paso = anteriores.get(paso);
        }

        int distanciaTotal = distancias.getOrDefault(destino, Integer.MAX_VALUE);
        boolean encontrado = distanciaTotal != Integer.MAX_VALUE;

        return Map.of(
            "encontrado", encontrado,
            "origen", origen,
            "destino", destino,
            "ruta", encontrado ? ruta : List.of(),
            "distanciaTotal", encontrado ? distanciaTotal : 0,
            "mensaje", encontrado
                ? "Ruta encontrada: " + String.join(" → ", ruta)
                : "No existe ruta entre " + origen + " y " + destino
        );
    }

    // ─────────────────────────────────────────
    // BFS — Recorrido por niveles desde un nodo
    // ─────────────────────────────────────────
    public List<String> bfs(String inicio) {
        List<String> visitados = new ArrayList<>();
        Set<String> vistos = new HashSet<>();
        Queue<String> cola = new LinkedList<>();

        cola.add(inicio);
        vistos.add(inicio);

        while (!cola.isEmpty()) {
            String actual = cola.poll();
            visitados.add(actual);

            for (Sendero sendero : getConexiones(actual)) {
                if (!vistos.contains(sendero.getDestino())) {
                    vistos.add(sendero.getDestino());
                    cola.add(sendero.getDestino());
                }
            }
        }
        return visitados;
    }

    // Obtener toda la estructura del grafo para visualización
    public Map<String, Object> getEstructura() {
        List<Map<String, Object>> nodos = new ArrayList<>();
        List<Map<String, Object>> aristas = new ArrayList<>();
        Set<String> aristasAgregadas = new HashSet<>();

        for (String nodo : adyacencia.keySet()) {
            nodos.add(Map.of("id", nodo, "label", nodo));

            for (Sendero sendero : adyacencia.get(nodo)) {
                String claveArista = nodo.compareTo(sendero.getDestino()) < 0
                    ? nodo + "-" + sendero.getDestino()
                    : sendero.getDestino() + "-" + nodo;

                if (!aristasAgregadas.contains(claveArista)) {
                    aristasAgregadas.add(claveArista);
                    aristas.add(Map.of(
                        "origen", nodo,
                        "destino", sendero.getDestino(),
                        "distancia", sendero.getDistancia()
                    ));
                }
            }
        }

        return Map.of("nodos", nodos, "aristas", aristas);
    }
}
