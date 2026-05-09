package com.techpark.model;

import java.time.LocalDateTime;

public abstract class Ticket {

    private String id;
    private double precio;
    private LocalDateTime fechaCompra;
    private Visitante visitante;    // a quién pertenece el ticket
    private boolean usado;          // si ya fue canjeado en una atracción

    // Constructor
    public Ticket(String id, double precio, Visitante visitante) {
        this.id = id;
        this.precio = precio;
        this.visitante = visitante;
        this.fechaCompra = LocalDateTime.now(); // fecha y hora exacta de compra
        this.usado = false;
    }

    // Método abstracto: cada tipo de ticket define su prioridad en la cola
    // Mayor número = mayor prioridad
    public abstract int getPrioridad();

    // Método concreto: marcar el ticket como usado
    public boolean canjear() {
        if (!usado) {
            this.usado = true;
            return true;  // canje exitoso
        }
        return false;     // ya fue usado antes
    }

    // Getters
    public String getId() { return id; }
    public double getPrecio() { return precio; }
    public LocalDateTime getFechaCompra() { return fechaCompra; }
    public Visitante getVisitante() { return visitante; }
    public boolean isUsado() { return usado; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setPrecio(double precio) { this.precio = precio; }
    public void setVisitante(Visitante visitante) { this.visitante = visitante; }
    public void setUsado(boolean usado) { this.usado = usado; }

    @Override
    public String toString() {
        return "[Ticket " + id + "] " + visitante.getNombre()
               + " | Precio: $" + precio
               + " | Usado: " + (usado ? "Sí" : "No");
    }
}
