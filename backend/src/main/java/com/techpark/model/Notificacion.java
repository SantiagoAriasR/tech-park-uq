package com.techpark.model;

import java.time.LocalDateTime;

public class Notificacion {

    public enum TipoNotificacion {
        ALERTA_CLIMATICA,
        CAMBIO_ESTADO_ATRACCION,
        TICKET_PROXIMO
    }

    private String id;
    private String documentoVisitante;
    private String mensaje;
    private TipoNotificacion tipo;
    private LocalDateTime fecha;
    private boolean leida;

    public Notificacion(String documentoVisitante, String mensaje,
                        TipoNotificacion tipo) {
        this.id = "N-" + System.currentTimeMillis();
        this.documentoVisitante = documentoVisitante;
        this.mensaje = mensaje;
        this.tipo = tipo;
        this.fecha = LocalDateTime.now();
        this.leida = false;
    }

    // Getters
    public String getId() { return id; }
    public String getDocumentoVisitante() { return documentoVisitante; }
    public String getMensaje() { return mensaje; }
    public TipoNotificacion getTipo() { return tipo; }
    public LocalDateTime getFecha() { return fecha; }
    public boolean isLeida() { return leida; }

    // Setters
    public void setLeida(boolean leida) { this.leida = leida; }

    @Override
    public String toString() {
        return "[" + tipo + "] " + mensaje;
    }
}