package com.techpark.model;

import java.util.ArrayList;
import java.util.List;

public class Parque {

    private String nombre;
    private int capacidadMax;           // visitantes máximos al mismo tiempo
    private int visitantesActuales;     // contador en tiempo real
    private List<Zona> zonas;
    private List<Visitante> visitantes; // visitantes registrados en el sistema

    // Constructor
    public Parque(String nombre, int capacidadMax) {
        this.nombre = nombre;
        this.capacidadMax = capacidadMax;
        this.visitantesActuales = 0;
        this.zonas = new ArrayList<>();
        this.visitantes = new ArrayList<>();
    }

    // Agregar una zona al parque
    public void agregarZona(Zona zona) {
        zonas.add(zona);
    }

    // Registrar un visitante nuevo en el sistema
    public boolean registrarVisitante(Visitante visitante) {
        if (visitantesActuales < capacidadMax) {
            visitantes.add(visitante);
            visitantesActuales++;
            return true;  // registro exitoso
        }
        return false;     // parque lleno
    }

    // Retirar un visitante del parque al salir
    public void retirarVisitante(Visitante visitante) {
        if (visitantes.remove(visitante)) {
            visitantesActuales--;
        }
    }

    // Buscar zona por nombre
    public Zona buscarZona(String nombre) {
        for (Zona z : zonas) {
            if (z.getNombre().equalsIgnoreCase(nombre)) {
                return z;
            }
        }
        return null;
    }

    // Buscar atracción en todo el parque (recorre todas las zonas)
    public Atraccion buscarAtraccion(String nombre) {
        for (Zona z : zonas) {
            Atraccion encontrada = z.buscarAtraccion(nombre);
            if (encontrada != null) {
                return encontrada;
            }
        }
        return null;
    }

    // Verificar si el parque tiene capacidad disponible
    public boolean tieneCapacidad() {
        return visitantesActuales < capacidadMax;
    }

    // Getters
    public String getNombre() { return nombre; }
    public int getCapacidadMax() { return capacidadMax; }
    public int getVisitantesActuales() { return visitantesActuales; }
    public List<Zona> getZonas() { return zonas; }
    public List<Visitante> getVisitantes() { return visitantes; }

    // Setters
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setCapacidadMax(int capacidadMax) { this.capacidadMax = capacidadMax; }

    @Override
    public String toString() {
        return "Parque: " + nombre
               + " | Visitantes: " + visitantesActuales + "/" + capacidadMax
               + " | Zonas: " + zonas.size();
    }
}
