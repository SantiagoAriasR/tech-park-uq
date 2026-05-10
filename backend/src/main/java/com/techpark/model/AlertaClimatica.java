package com.techpark.model;

import java.time.LocalDateTime;

public class AlertaClimatica {

    public enum TipoAlerta {
        TORMENTA_ELECTRICA,
        LLUVIA_FUERTE,
        VIENTO_FUERTE,
        NORMALIDAD
    }

    private TipoAlerta tipo;
    private String descripcion;
    private LocalDateTime fechaHora;
    private boolean activa;

    public AlertaClimatica(TipoAlerta tipo, String descripcion) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fechaHora = LocalDateTime.now();
        this.activa = true;
    }

    // Getters
    public TipoAlerta getTipo() { return tipo; }
    public String getDescripcion() { return descripcion; }
    public LocalDateTime getFechaHora() { return fechaHora; }
    public boolean isActiva() { return activa; }

    // Setters
    public void setActiva(boolean activa) { this.activa = activa; }

    @Override
    public String toString() {
        return "[" + tipo + "] " + descripcion + " — " + fechaHora;
    }
}
