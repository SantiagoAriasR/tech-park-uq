package com.techpark.model;

public abstract class Atraccion {

    private String id;
    private String nombre;
    private String tipo;           // descripción del tipo de atracción
    private int capacidad;         // personas por turno
    private double alturaMinima;   // en metros
    private int edadMinima;        // en años
    private double costoExtra;     // costo adicional al ticket base
    private EstadoAtraccion estado;
    private int tiempoEsperaMin;   // tiempo estimado de espera en minutos

    // Constructor
    public Atraccion(String id, String nombre, String tipo,
                     int capacidad, double alturaMinima,
                     int edadMinima, double costoExtra) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.capacidad = capacidad;
        this.alturaMinima = alturaMinima;
        this.edadMinima = edadMinima;
        this.costoExtra = costoExtra;
        this.estado = EstadoAtraccion.ACTIVA; // por defecto activa al crear
        this.tiempoEsperaMin = 0;
    }

    // Método abstracto: cada tipo de atracción valida sus propias restricciones
    public abstract boolean visitanteCumpleRequisitos(Visitante visitante);

    // Método concreto: verifica si la atracción está disponible
    public boolean estaDisponible() {
        return this.estado == EstadoAtraccion.ACTIVA;
    }

    // Método concreto: cambia el estado de la atracción
    public void cambiarEstado(EstadoAtraccion nuevoEstado) {
        this.estado = nuevoEstado;
    }

    // Getters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getTipo() { return tipo; }
    public int getCapacidad() { return capacidad; }
    public double getAlturaMinima() { return alturaMinima; }
    public int getEdadMinima() { return edadMinima; }
    public double getCostoExtra() { return costoExtra; }
    public EstadoAtraccion getEstado() { return estado; }
    public int getTiempoEsperaMin() { return tiempoEsperaMin; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setCapacidad(int capacidad) { this.capacidad = capacidad; }
    public void setAlturaMinima(double alturaMinima) { this.alturaMinima = alturaMinima; }
    public void setEdadMinima(int edadMinima) { this.edadMinima = edadMinima; }
    public void setCostoExtra(double costoExtra) { this.costoExtra = costoExtra; }
    public void setEstado(EstadoAtraccion estado) { this.estado = estado; }
    public void setTiempoEsperaMin(int tiempoEsperaMin) { this.tiempoEsperaMin = tiempoEsperaMin; }

    @Override
    public String toString() {
        return "[" + tipo + "] " + nombre + " | Estado: " + estado
               + " | Capacidad: " + capacidad + " | Espera: " + tiempoEsperaMin + " min";
    }
}
