package com.techpark.model;

public class Operador extends Usuario {

    private String zonaAsignada; // nombre de la zona que supervisa
    private boolean disponible;  // si está activo en su turno

    // Constructor
    public Operador(String id, String nombre, String documento,
                    String email, String contrasena,
                    String zonaAsignada) {
        super(id, nombre, documento, email, contrasena);
        this.zonaAsignada = zonaAsignada;
        this.disponible = true; // por defecto está disponible al crear
    }

    // Implementación obligatoria del método abstracto
    @Override
    public String getTipoUsuario() {
        return "OPERADOR";
    }

    // Método propio: cambiar disponibilidad en el turno
    public void cambiarDisponibilidad() {
        this.disponible = !this.disponible;
    }

    // Getters
    public String getZonaAsignada() { return zonaAsignada; }
    public boolean isDisponible() { return disponible; }

    // Setters
    public void setZonaAsignada(String zonaAsignada) { this.zonaAsignada = zonaAsignada; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }

    @Override
    public String toString() {
        return super.toString() + " | Zona: " + zonaAsignada
               + " | Disponible: " + (disponible ? "Sí" : "No");
    }
}
