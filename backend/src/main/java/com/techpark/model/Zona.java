package com.techpark.model;

import java.util.ArrayList;
import java.util.List;

public class Zona {

    private String id;
    private String nombre;
    private int capacidadMax;
    private List<Atraccion> atracciones;  // atracciones dentro de esta zona
    private List<Operador> operadores;    // operadores asignados a esta zona

    // Constructor
    public Zona(String id, String nombre, int capacidadMax) {
        this.id = id;
        this.nombre = nombre;
        this.capacidadMax = capacidadMax;
        this.atracciones = new ArrayList<>();
        this.operadores = new ArrayList<>();
    }

    // Agregar una atracción a la zona
    public void agregarAtraccion(Atraccion atraccion) {
        atracciones.add(atraccion);
    }

    // Agregar un operador a la zona
    public void agregarOperador(Operador operador) {
        operador.setZonaAsignada(this.nombre); // sincroniza la zona en el operador
        operadores.add(operador);
    }

    // Buscar atracción por nombre dentro de la zona
    public Atraccion buscarAtraccion(String nombre) {
        for (Atraccion a : atracciones) {
            if (a.getNombre().equalsIgnoreCase(nombre)) {
                return a;
            }
        }
        return null; // no encontrada
    }

    // Contar atracciones activas en la zona
    public int contarAtraccionesActivas() {
        int contador = 0;
        for (Atraccion a : atracciones) {
            if (a.estaDisponible()) {
                contador++;
            }
        }
        return contador;
    }

    // Getters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public int getCapacidadMax() { return capacidadMax; }
    public List<Atraccion> getAtracciones() { return atracciones; }
    public List<Operador> getOperadores() { return operadores; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setCapacidadMax(int capacidadMax) { this.capacidadMax = capacidadMax; }

    @Override
    public String toString() {
        return "Zona: " + nombre + " | Atracciones: " + atracciones.size()
               + " | Activas: " + contarAtraccionesActivas();
    }
}
