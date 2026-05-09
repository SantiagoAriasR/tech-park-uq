package com.techpark.estructuras;

import com.techpark.model.Atraccion;
import java.util.ArrayList;
import java.util.List;

public class ArbolBinarioBusqueda {

    private NodoABB raiz;

    // Constructor
    public ArbolBinarioBusqueda() {
        this.raiz = null;
    }

    // Insertar una atracción en el árbol
    public void insertar(Atraccion atraccion) {
        raiz = insertarRecursivo(raiz, atraccion);
    }

    private NodoABB insertarRecursivo(NodoABB nodo, Atraccion atraccion) {
        if (nodo == null) {
            return new NodoABB(atraccion); // posición encontrada
        }
        int comparacion = atraccion.getNombre()
                            .compareToIgnoreCase(nodo.dato.getNombre());
        if (comparacion < 0) {
            nodo.izquierdo = insertarRecursivo(nodo.izquierdo, atraccion);
        } else if (comparacion > 0) {
            nodo.derecho = insertarRecursivo(nodo.derecho, atraccion);
        }
        // Si comparacion == 0 el nombre ya existe, no se inserta duplicado
        return nodo;
    }

    // Buscar atracción por nombre — retorna null si no existe
    public Atraccion buscar(String nombre) {
        return buscarRecursivo(raiz, nombre);
    }

    private Atraccion buscarRecursivo(NodoABB nodo, String nombre) {
        if (nodo == null) return null; // no encontrado

        int comparacion = nombre.compareToIgnoreCase(nodo.dato.getNombre());

        if (comparacion == 0) return nodo.dato;       // encontrado
        if (comparacion < 0) return buscarRecursivo(nodo.izquierdo, nombre);
        return buscarRecursivo(nodo.derecho, nombre);
    }

    // Listar todas las atracciones en orden alfabético (recorrido inorden)
    public List<Atraccion> listarEnOrden() {
        List<Atraccion> resultado = new ArrayList<>();
        inorden(raiz, resultado);
        return resultado;
    }

    private void inorden(NodoABB nodo, List<Atraccion> resultado) {
        if (nodo == null) return;
        inorden(nodo.izquierdo, resultado);  // primero izquierda
        resultado.add(nodo.dato);            // luego el nodo actual
        inorden(nodo.derecho, resultado);    // luego derecha
    }

    // Verificar si el árbol está vacío
    public boolean estaVacio() {
        return raiz == null;
    }
}
