package com.techpark;

import com.techpark.estructuras.ArbolBinarioBusqueda;
import com.techpark.model.AtraccionMecanica;
import com.techpark.model.Atraccion;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;

public class ArbolBinarioBusquedaTest {

    @Test
    @DisplayName("Buscar atraccion existente retorna el objeto correcto")
    void buscarAtraccionExistente() {
        ArbolBinarioBusqueda abb = new ArbolBinarioBusqueda();
        AtraccionMecanica montana = new AtraccionMecanica(
            "A1", "Montana Rusa", 20, 1.40, 12, 15000, 120);

        abb.insertar(montana);
        Atraccion resultado = abb.buscar("Montana Rusa");

        assertNotNull(resultado, "Debe encontrar la atraccion insertada");
        assertEquals("Montana Rusa", resultado.getNombre());
    }

    @Test
    @DisplayName("Buscar atraccion inexistente retorna null")
    void buscarAtraccionInexistente() {
        ArbolBinarioBusqueda abb = new ArbolBinarioBusqueda();
        assertNull(abb.buscar("No Existe"),
            "Buscar en arbol vacio debe retornar null");
    }

    @Test
    @DisplayName("Listar en orden retorna atracciones alfabeticamente")
    void listarEnOrdenAlfabetico() {
        ArbolBinarioBusqueda abb = new ArbolBinarioBusqueda();
        abb.insertar(new AtraccionMecanica("A3", "Tornado", 10, 1.50, 14, 20000, 90));
        abb.insertar(new AtraccionMecanica("A1", "Carrusel", 25, 1.00, 4, 5000, 20));
        abb.insertar(new AtraccionMecanica("A2", "Montana Rusa", 20, 1.40, 12, 15000, 120));

        List<Atraccion> ordenadas = abb.listarEnOrden();

        assertEquals("Carrusel", ordenadas.get(0).getNombre());
        assertEquals("Montana Rusa", ordenadas.get(1).getNombre());
        assertEquals("Tornado", ordenadas.get(2).getNombre());
    }
}
