package com.techpark.model;

public class AtraccionMecanica extends Atraccion {

    private double velocidadMaxKmh; // velocidad máxima en km/h

    // Constructor
    public AtraccionMecanica(String id, String nombre, int capacidad,
                              double alturaMinima, int edadMinima,
                              double costoExtra, double velocidadMaxKmh) {
        super(id, nombre, "MECÁNICA", capacidad, alturaMinima, edadMinima, costoExtra);
        this.velocidadMaxKmh = velocidadMaxKmh;
    }

    // Implementación obligatoria: valida altura y edad mínima
    @Override
    public boolean visitanteCumpleRequisitos(Visitante visitante) {
        return visitante.getEstatura() >= getAlturaMinima()
            && visitante.getEdad() >= getEdadMinima();
    }

    // Getter y Setter
    public double getVelocidadMaxKmh() { return velocidadMaxKmh; }
    public void setVelocidadMaxKmh(double velocidadMaxKmh) {
        this.velocidadMaxKmh = velocidadMaxKmh;
    }

    @Override
    public String toString() {
        return super.toString() + " | Velocidad máx: " + velocidadMaxKmh + " km/h";
    }
}
