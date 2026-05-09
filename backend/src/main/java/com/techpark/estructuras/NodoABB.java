package com.techpark.estructuras;

import com.techpark.model.Atraccion;

public class NodoABB {

    public Atraccion dato;
    public NodoABB izquierdo; // atracciones con nombre menor (alfabéticamente)
    public NodoABB derecho;   // atracciones con nombre mayor

    // Constructor
    public NodoABB(Atraccion dato) {
        this.dato = dato;
        this.izquierdo = null;
        this.derecho = null;
    }
}
