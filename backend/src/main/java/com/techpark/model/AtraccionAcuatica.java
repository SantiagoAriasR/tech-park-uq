package com.techpark.model;

public class AtraccionAcuatica extends Atraccion {

    private double profundidadMaxMetros;

    // Constructor
    public AtraccionAcuatica(String id, String nombre, int capacidad,
                              double alturaMinima, int edadMinima,
                              double costoExtra, double profundidadMaxMetros) {
        super(id, nombre, "ACUÁTICA", capacidad, alturaMinima, edadMinima, costoExtra);
        this.profundidadMaxMetros = profundidadMaxMetros;
    }

    // Implementación obligatoria: valida altura, edad y agrega restricción de profundidad
    @Override
    public boolean visitanteCumpleRequisitos(Visitante visitante) {
        // Para atracciones acuáticas solo validamos edad y estatura
        // La profundidad es una característica física, no una restricción del visitante
        return visitante.getEstatura() >= getAlturaMinima()
            && visitante.getEdad() >= getEdadMinima();
    }

    // Getter y Setter
    public double getProfundidadMaxMetros() { return profundidadMaxMetros; }
    public void setProfundidadMaxMetros(double profundidadMaxMetros) {
        this.profundidadMaxMetros = profundidadMaxMetros;
    }

    @Override
    public String toString() {
        return super.toString() + " | Profundidad máx: " + profundidadMaxMetros + " m";
    }
}
