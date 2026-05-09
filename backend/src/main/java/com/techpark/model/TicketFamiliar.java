package com.techpark.model;

public class TicketFamiliar extends Ticket {

    private int cantidadPersonas;
    private static final double DESCUENTO = 0.15; // 15% de descuento

    // Constructor
    public TicketFamiliar(String id, Visitante visitante, int cantidadPersonas) {
        super(id, calcularPrecio(cantidadPersonas), visitante);
        this.cantidadPersonas = cantidadPersonas;
    }

    // Calcula el precio con descuento según cantidad de personas
    private static double calcularPrecio(int personas) {
        double precioBase = 25000.0 * personas;
        return precioBase * (1 - DESCUENTO); // aplica el 15% de descuento
    }

    // Prioridad media
    @Override
    public int getPrioridad() {
        return 2;
    }

    // Getter y Setter
    public int getCantidadPersonas() { return cantidadPersonas; }
    public void setCantidadPersonas(int cantidadPersonas) {
        this.cantidadPersonas = cantidadPersonas;
    }

    @Override
    public String toString() {
        return "[FAMILIAR x" + cantidadPersonas + "] " + super.toString();
    }
}