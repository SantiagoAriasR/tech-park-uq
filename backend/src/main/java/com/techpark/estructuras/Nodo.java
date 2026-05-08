package com.techpark.estructuras;

// Clase genérica: T puede ser cualquier tipo (Atraccion, Visitante, Ticket...)
public class Nodo<T> {

    public T dato;        // el valor almacenado
    public Nodo<T> siguiente; // apunta al siguiente nodo en la lista

    // Constructor
    public Nodo(T dato) {
        this.dato = dato;
        this.siguiente = null; // al crearse, no apunta a ningún lado
    }
}
