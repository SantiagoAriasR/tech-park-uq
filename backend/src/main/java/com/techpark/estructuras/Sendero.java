package com.techpark.estructuras;

// Representa una conexión entre dos atracciones en el grafo
public class Sendero {

    private String destino;  // nombre de la atracción destino
    private int distancia;   // peso de la arista (metros o tiempo en minutos)

    public Sendero(String destino, int distancia) {
        this.destino = destino;
        this.distancia = distancia;
    }

    public String getDestino() { return destino; }
    public int getDistancia() { return distancia; }

    @Override
    public String toString() {
        return destino + "(" + distancia + ")";
    }
}