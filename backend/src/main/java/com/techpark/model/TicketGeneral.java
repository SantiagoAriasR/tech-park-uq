package com.techpark.model;

public class TicketGeneral extends Ticket {

    // Constructor
    public TicketGeneral(String id, Visitante visitante) {
        super(id, 25000.0, visitante); // precio base del ticket general
    }

    // Prioridad más baja — entra en orden de llegada
    @Override
    public int getPrioridad() {
        return 1;
    }

    @Override
    public String toString() {
        return "[GENERAL] " + super.toString();
    }
}
