package com.techpark.model;

public class TicketFastPass extends Ticket {

    private int saltosPermitidos; // cuántas veces puede saltarse la fila

    // Constructor
    public TicketFastPass(String id, Visitante visitante) {
        super(id, 80000.0, visitante); // precio premium
        this.saltosPermitidos = 3;     // puede saltarse la fila 3 veces
    }

    // Prioridad más alta — siempre pasa primero
    @Override
    public int getPrioridad() {
        return 3;
    }

    // Usa un salto de fila si le quedan disponibles
    public boolean usarSalto() {
        if (saltosPermitidos > 0) {
            saltosPermitidos--;
            return true;
        }
        return false; // ya no le quedan saltos
    }

    // Getter y Setter
    public int getSaltosPermitidos() { return saltosPermitidos; }
    public void setSaltosPermitidos(int saltosPermitidos) {
        this.saltosPermitidos = saltosPermitidos;
    }

    @Override
    public String toString() {
        return "[FASTPASS] " + super.toString()
               + " | Saltos restantes: " + saltosPermitidos;
    }
}
