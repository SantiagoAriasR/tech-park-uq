package com.techpark.estructuras;

import com.techpark.model.Ticket;

public class ColaPrioridad {

    private Nodo<Ticket> cabeza;
    private int tamanio;

    // Constructor
    public ColaPrioridad() {
        this.cabeza = null;
        this.tamanio = 0;
    }

    // Encolar un ticket respetando su prioridad
    // Mayor prioridad queda más al frente
    public void encolar(Ticket ticket) {
        Nodo<Ticket> nuevo = new Nodo<>(ticket);

        // Si está vacía o el nuevo tiene mayor prioridad que la cabeza
        if (cabeza == null || ticket.getPrioridad() > cabeza.dato.getPrioridad()) {
            nuevo.siguiente = cabeza;
            cabeza = nuevo;
        } else {
            // Busca la posición correcta según prioridad
            Nodo<Ticket> actual = cabeza;
            while (actual.siguiente != null
                    && actual.siguiente.dato.getPrioridad() >= ticket.getPrioridad()) {
                actual = actual.siguiente;
            }
            nuevo.siguiente = actual.siguiente;
            actual.siguiente = nuevo;
        }
        tamanio++;
    }

    // Desencolar — saca el primero (mayor prioridad)
    public Ticket desencolar() {
        if (estaVacia()) return null;
        Ticket ticket = cabeza.dato;
        cabeza = cabeza.siguiente;
        tamanio--;
        return ticket;
    }

    // Ver el primero sin sacarlo
    public Ticket verPrimero() {
        if (estaVacia()) return null;
        return cabeza.dato;
    }

    // Verificar si está vacía
    public boolean estaVacia() {
        return tamanio == 0;
    }

    // Obtener el tamaño
    public int getTamanio() {
        return tamanio;
    }

    // Imprimir la cola de mayor a menor prioridad
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Cola [");
        Nodo<Ticket> actual = cabeza;
        while (actual != null) {
            sb.append(actual.dato.getVisitante().getNombre())
              .append("(P").append(actual.dato.getPrioridad()).append(")");
            if (actual.siguiente != null) sb.append(" → ");
            actual = actual.siguiente;
        }
        sb.append("]");
        return sb.toString();
    }
}