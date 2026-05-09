package com.techpark.estructuras;

import java.util.ArrayList;
import java.util.List;

public class SetFavoritos {

    private ListaEnlazada<String> elementos;

    public SetFavoritos() {
        this.elementos = new ListaEnlazada<>();
    }

    // Agregar solo si no existe — retorna false si ya estaba
    public boolean agregar(String valor) {
        if (contiene(valor)) return false;
        elementos.agregar(valor);
        return true;
    }

    // Eliminar un elemento
    public boolean eliminar(String valor) {
        Nodo<String> actual = elementos.getCabeza();
        int indice = 0;
        while (actual != null) {
            if (actual.dato.equalsIgnoreCase(valor)) {
                return elementos.eliminar(indice);
            }
            actual = actual.siguiente;
            indice++;
        }
        return false;
    }

    // Verificar si existe
    public boolean contiene(String valor) {
        Nodo<String> actual = elementos.getCabeza();
        while (actual != null) {
            if (actual.dato.equalsIgnoreCase(valor)) return true;
            actual = actual.siguiente;
        }
        return false;
    }

    // Convertir a lista para enviar como JSON
    public List<String> aLista() {
        List<String> lista = new ArrayList<>();
        Nodo<String> actual = elementos.getCabeza();
        while (actual != null) {
            lista.add(actual.dato);
            actual = actual.siguiente;
        }
        return lista;
    }

    public int getTamanio() {
        return elementos.getTamanio();
    }
}
