package com.techpark;

import com.techpark.estructuras.GrafoParque;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import java.util.Map;

public class GrafoParqueTest {

    private GrafoParque grafo;

    @BeforeEach
    void setUp() {
        grafo = new GrafoParque();
        grafo.agregarNodo("Entrada");
        grafo.agregarNodo("AtraccionA");
        grafo.agregarNodo("AtraccionB");
        grafo.agregarNodo("AtraccionC");

        grafo.agregarConexion("Entrada", "AtraccionA", 100);
        grafo.agregarConexion("Entrada", "AtraccionB", 300);
        grafo.agregarConexion("AtraccionA", "AtraccionC", 100);
        grafo.agregarConexion("AtraccionB", "AtraccionC", 50);
    }

    @Test
    @DisplayName("Dijkstra encuentra la ruta mas corta correcta")
    void dijkstraEncuentraRutaMasCorta() {
        // Ruta directa Entrada->AtraccionB->AtraccionC = 350
        // Ruta por A: Entrada->AtraccionA->AtraccionC = 200 (mas corta)
        Map<String, Object> resultado = grafo.dijkstra("Entrada", "AtraccionC");

        assertTrue((Boolean) resultado.get("encontrado"));
        assertEquals(200, resultado.get("distanciaTotal"),
            "La ruta mas corta debe ser 200");

        List<String> ruta = (List<String>) resultado.get("ruta");
        assertEquals("Entrada", ruta.get(0));
        assertEquals("AtraccionC", ruta.get(ruta.size() - 1));
    }

    @Test
    @DisplayName("Dijkstra retorna no encontrado para nodo inexistente")
    void dijkstraNoEncuentraRutaInexistente() {
        Map<String, Object> resultado = grafo.dijkstra("Entrada", "NoExiste");
        assertFalse((Boolean) resultado.get("encontrado"),
            "Debe retornar false para destino inexistente");
    }

    @Test
    @DisplayName("BFS recorre todos los nodos alcanzables")
    void bfsRecorreTodosLosNodos() {
        List<String> recorrido = grafo.bfs("Entrada");
        assertEquals(4, recorrido.size(),
            "BFS debe recorrer los 4 nodos del grafo");
        assertTrue(recorrido.contains("Entrada"));
        assertTrue(recorrido.contains("AtraccionC"));
    }
}
