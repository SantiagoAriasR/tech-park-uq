package com.techpark.model;

import java.time.LocalDateTime;

public class RevisionTecnica {

    public enum Resultado {
        APROBADA,
        REQUIERE_MANTENIMIENTO,
        FUERA_DE_SERVICIO
    }

    private String id;
    private String nombreAtraccion;
    private String nombreOperador;
    private LocalDateTime fecha;
    private Resultado resultado;
    private String observaciones;

    public RevisionTecnica(String id, String nombreAtraccion,
                           String nombreOperador, Resultado resultado,
                           String observaciones) {
        this.id = id;
        this.nombreAtraccion = nombreAtraccion;
        this.nombreOperador = nombreOperador;
        this.fecha = LocalDateTime.now();
        this.resultado = resultado;
        this.observaciones = observaciones;
    }

    // Getters
    public String getId() { return id; }
    public String getNombreAtraccion() { return nombreAtraccion; }
    public String getNombreOperador() { return nombreOperador; }
    public LocalDateTime getFecha() { return fecha; }
    public Resultado getResultado() { return resultado; }
    public String getObservaciones() { return observaciones; }

    @Override
    public String toString() {
        return "[" + resultado + "] " + nombreAtraccion
               + " — " + nombreOperador + " — " + fecha;
    }
}
