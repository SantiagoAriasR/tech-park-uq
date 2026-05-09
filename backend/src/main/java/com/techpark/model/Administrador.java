package com.techpark.model;

public class Administrador extends Usuario {

    private String nivelAcceso; // ej: "TOTAL", "PARCIAL"

    // Constructor
    public Administrador(String id, String nombre, String documento,
                         String email, String contrasena,
                         String nivelAcceso) {
        super(id, nombre, documento, email, contrasena);
        this.nivelAcceso = nivelAcceso;
    }

    // Implementación obligatoria del método abstracto
    @Override
    public String getTipoUsuario() {
        return "ADMINISTRADOR";
    }

    // Método propio: verificar si tiene acceso total
    public boolean tieneAccesoTotal() {
        return "TOTAL".equals(nivelAcceso);
    }

    // Getters
    public String getNivelAcceso() { return nivelAcceso; }

    // Setters
    public void setNivelAcceso(String nivelAcceso) { this.nivelAcceso = nivelAcceso; }

    @Override
    public String toString() {
        return super.toString() + " | Nivel: " + nivelAcceso;
    }
}
