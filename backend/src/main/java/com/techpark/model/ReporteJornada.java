package com.techpark.model;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class ReporteJornada {

    private LocalDate fecha;
    private int totalVisitantes;
    private double ingresosTotales;
    private List<Map<String, Object>> atraccionesTop;
    private int totalTicketsVendidos;
    private int cierresPorClima;
    private int alertasMantenimiento;

    // Constructor
    public ReporteJornada(LocalDate fecha, int totalVisitantes,
                          double ingresosTotales,
                          List<Map<String, Object>> atraccionesTop,
                          int totalTicketsVendidos,
                          int cierresPorClima,
                          int alertasMantenimiento) {
        this.fecha = fecha;
        this.totalVisitantes = totalVisitantes;
        this.ingresosTotales = ingresosTotales;
        this.atraccionesTop = atraccionesTop;
        this.totalTicketsVendidos = totalTicketsVendidos;
        this.cierresPorClima = cierresPorClima;
        this.alertasMantenimiento = alertasMantenimiento;
    }

    // Getters
    public LocalDate getFecha() { return fecha; }
    public int getTotalVisitantes() { return totalVisitantes; }
    public double getIngresosTotales() { return ingresosTotales; }
    public List<Map<String, Object>> getAtraccionesTop() { return atraccionesTop; }
    public int getTotalTicketsVendidos() { return totalTicketsVendidos; }
    public int getCierresPorClima() { return cierresPorClima; }
    public int getAlertasMantenimiento() { return alertasMantenimiento; }
}
