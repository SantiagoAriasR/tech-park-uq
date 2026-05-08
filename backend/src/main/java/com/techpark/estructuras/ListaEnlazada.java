package com.techpark.estructuras;

public class ListaEnlazada<T> {

    private Nodo<T> cabeza; // primer nodo de la lista
    private int tamanio;    // cantidad de elementos

    // Constructor
    public ListaEnlazada() {
        this.cabeza = null;
        this.tamanio = 0;
    }

    // Agregar al final de la lista
    public void agregar(T dato) {
        Nodo<T> nuevo = new Nodo<>(dato);
        if (cabeza == null) {
            cabeza = nuevo; // si está vacía, el nuevo es la cabeza
        } else {
            Nodo<T> actual = cabeza;
            while (actual.siguiente != null) {
                actual = actual.siguiente; // recorre hasta el último nodo
            }
            actual.siguiente = nuevo; // enlaza el nuevo al final
        }
        tamanio++;
    }

    // Agregar al inicio de la lista
    public void agregarAlInicio(T dato) {
        Nodo<T> nuevo = new Nodo<>(dato);
        nuevo.siguiente = cabeza;
        cabeza = nuevo;
        tamanio++;
    }

    // Obtener elemento por índice (posición)
    public T obtener(int indice) {
        if (indice < 0 || indice >= tamanio) {
            throw new IndexOutOfBoundsException("Índice fuera de rango: " + indice);
        }
        Nodo<T> actual = cabeza;
        for (int i = 0; i < indice; i++) {
            actual = actual.siguiente;
        }
        return actual.dato;
    }

    // Eliminar por índice
    public boolean eliminar(int indice) {
        if (indice < 0 || indice >= tamanio) return false;

        if (indice == 0) {
            cabeza = cabeza.siguiente; // elimina la cabeza
        } else {
            Nodo<T> actual = cabeza;
            for (int i = 0; i < indice - 1; i++) {
                actual = actual.siguiente; // llega al nodo anterior al que se elimina
            }
            actual.siguiente = actual.siguiente.siguiente; // salta el nodo eliminado
        }
        tamanio--;
        return true;
    }

    // Verificar si la lista está vacía
    public boolean estaVacia() {
        return tamanio == 0;
    }

    // Obtener el tamaño
    public int getTamanio() {
        return tamanio;
    }

    // Obtener la cabeza (para recorrer externamente)
    public Nodo<T> getCabeza() {
        return cabeza;
    }

    // Convertir a String para imprimir
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("[");
        Nodo<T> actual = cabeza;
        while (actual != null) {
            sb.append(actual.dato);
            if (actual.siguiente != null) sb.append(" → ");
            actual = actual.siguiente;
        }
        sb.append("]");
        return sb.toString();
    }
}
