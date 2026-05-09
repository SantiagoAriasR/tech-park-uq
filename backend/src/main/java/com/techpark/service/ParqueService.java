package com.techpark.service;

import com.techpark.model.*;
import com.techpark.estructuras.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service // le dice a Spring Boot que esta clase es un servicio administrado por él
public class ParqueService {

    // El parque es único — patrón Singleton implícito
    private Parque parque;

    // Estructuras de datos propias
    private ArbolBinarioBusqueda arbolAtracciones;
    private ListaEnlazada<Visitante> listaVisitantes;
    private ListaEnlazada<Operador> listaOperadores;

    // Constructor — inicializa el parque con datos base
    public ParqueService() {
        this.parque = new Parque("Tech-Park UQ", 500);
        this.arbolAtracciones = new ArbolBinarioBusqueda();
        this.listaVisitantes = new ListaEnlazada<>();
        this.listaOperadores = new ListaEnlazada<>();
        inicializarDatosDePrueba();
    }

    // ─────────────────────────────────────────
    // ZONA
    // ─────────────────────────────────────────

    public void agregarZona(Zona zona) {
        parque.agregarZona(zona);
    }

    public Zona buscarZona(String nombre) {
        return parque.buscarZona(nombre);
    }

    public List<Zona> listarZonas() {
        return parque.getZonas();
    }

    // ─────────────────────────────────────────
    // ATRACCIONES
    // ─────────────────────────────────────────

    public void agregarAtraccion(Atraccion atraccion, String nombreZona) {
        Zona zona = parque.buscarZona(nombreZona);
        if (zona != null) {
            zona.agregarAtraccion(atraccion);
            arbolAtracciones.insertar(atraccion); // también en el ABB para búsqueda rápida
        }
    }

    public Atraccion buscarAtraccionPorNombre(String nombre) {
        return arbolAtracciones.buscar(nombre); // búsqueda O(log n) en el ABB
    }

    public List<Atraccion> listarAtraccionesOrdenadas() {
        return arbolAtracciones.listarEnOrden(); // alfabético
    }

    public boolean cambiarEstadoAtraccion(String nombre, EstadoAtraccion nuevoEstado) {
        Atraccion atraccion = arbolAtracciones.buscar(nombre);
        if (atraccion != null) {
            atraccion.cambiarEstado(nuevoEstado);
            return true;
        }
        return false;
    }

    // ─────────────────────────────────────────
    // VISITANTES
    // ─────────────────────────────────────────

    public boolean registrarVisitante(Visitante visitante) {
        if (parque.registrarVisitante(visitante)) {
            listaVisitantes.agregar(visitante);
            return true;
        }
        return false; // parque lleno
    }

    public Visitante buscarVisitante(String documento) {
        Nodo<Visitante> actual = listaVisitantes.getCabeza();
        while (actual != null) {
            if (actual.dato.getDocumento().equals(documento)) {
                return actual.dato;
            }
            actual = actual.siguiente;
        }
        return null; // no encontrado
    }

    public ListaEnlazada<Visitante> getListaVisitantes() {
        return listaVisitantes;
    }

    // ─────────────────────────────────────────
    // OPERADORES
    // ─────────────────────────────────────────

    public void registrarOperador(Operador operador) {
        listaOperadores.agregar(operador);
    }

    public Operador buscarOperador(String documento) {
        Nodo<Operador> actual = listaOperadores.getCabeza();
        while (actual != null) {
            if (actual.dato.getDocumento().equals(documento)) {
                return actual.dato;
            }
            actual = actual.siguiente;
        }
        return null;
    }

    public ListaEnlazada<Operador> getListaOperadores() {
        return listaOperadores;
    }

    // ─────────────────────────────────────────
    // TICKETS Y COLA
    // ─────────────────────────────────────────

    public boolean comprarTicket(String documento, String tipoTicket, String nombreAtraccion) {
        Visitante visitante = buscarVisitante(documento);
        Atraccion atraccion = buscarAtraccionPorNombre(nombreAtraccion);

        if (visitante == null || atraccion == null) return false;
        if (!atraccion.estaDisponible()) return false;
        if (!atraccion.visitanteCumpleRequisitos(visitante)) return false;

        // Crear el ticket según el tipo
        Ticket ticket;
        String id = "T-" + System.currentTimeMillis();

        switch (tipoTicket.toUpperCase()) {
            case "FASTPASS":
                ticket = new TicketFastPass(id, visitante);
                break;
            case "FAMILIAR":
                ticket = new TicketFamiliar(id, visitante, 2);
                break;
            default:
                ticket = new TicketGeneral(id, visitante);
        }

        // Descontar saldo al visitante
        if (!visitante.descontarSaldo(ticket.getPrecio())) {
            return false; // saldo insuficiente
        }

        // Encolar en la atracción correspondiente
        ColaPrioridad cola = obtenerColaDeAtraccion(nombreAtraccion);
        if (cola != null) {
            cola.encolar(ticket);
        }

        return true;
    }

    // Mapa simple de colas por atracción usando la lista enlazada
    private ListaEnlazada<Object[]> colasDeAtracciones = new ListaEnlazada<>();

    public ColaPrioridad obtenerColaDeAtraccion(String nombreAtraccion) {
        Nodo<Object[]> actual = colasDeAtracciones.getCabeza();
        while (actual != null) {
            if (actual.dato[0].equals(nombreAtraccion)) {
                return (ColaPrioridad) actual.dato[1];
            }
            actual = actual.siguiente;
        }
        // Si no existe, crea una nueva cola para esa atracción
        ColaPrioridad nuevaCola = new ColaPrioridad();
        colasDeAtracciones.agregar(new Object[]{nombreAtraccion, nuevaCola});
        return nuevaCola;
    }

    // ─────────────────────────────────────────
    // INFO GENERAL DEL PARQUE
    // ─────────────────────────────────────────

    public Parque getParque() {
        return parque;
    }

    public int getVisitantesActuales() {
        return parque.getVisitantesActuales();
    }

    public boolean tieneCapacidad() {
        return parque.tieneCapacidad();
    }

    // ─────────────────────────────────────────
    // DATOS DE PRUEBA
    // ─────────────────────────────────────────

    private void inicializarDatosDePrueba() {
        // Crear zonas
        Zona zonaAventura = new Zona("Z1", "Zona Aventura", 100);
        Zona zonaAcuatica = new Zona("Z2", "Zona Acuática", 80);
        parque.agregarZona(zonaAventura);
        parque.agregarZona(zonaAcuatica);

        // Crear atracciones mecánicas
        AtraccionMecanica montana = new AtraccionMecanica(
            "A1", "Montaña Rusa Extrema", 20, 1.40, 12, 15000, 120);
        AtraccionMecanica freefall = new AtraccionMecanica(
            "A2", "Free Fall Tower", 10, 1.50, 14, 20000, 80);

        // Crear atracciones acuáticas
        AtraccionAcuatica rapids = new AtraccionAcuatica(
            "A3", "Rapids River", 15, 1.20, 8, 10000, 1.5);
        AtraccionAcuatica splash = new AtraccionAcuatica(
            "A4", "Splash Zone", 25, 1.10, 6, 8000, 0.8);

        // Agregar atracciones a zonas y al ABB
        agregarAtraccion(montana, "Zona Aventura");
        agregarAtraccion(freefall, "Zona Aventura");
        agregarAtraccion(rapids, "Zona Acuática");
        agregarAtraccion(splash, "Zona Acuática");

        // Crear visitantes de prueba
        Visitante v1 = new Visitante("V1", "Carlos García", "123456",
                                     "carlos@email.com", "1234", 25, 150000, 1.75);
        Visitante v2 = new Visitante("V2", "Ana López", "789012",
                                     "ana@email.com", "1234", 17, 80000, 1.60);
        registrarVisitante(v1);
        registrarVisitante(v2);

        // Crear operadores de prueba
        Operador op1 = new Operador("O1", "Juan Pérez", "111111",
                                    "juan@techpark.com", "op123", "Zona Aventura");
        Operador op2 = new Operador("O2", "María Torres", "222222",
                                    "maria@techpark.com", "op123", "Zona Acuática");
        registrarOperador(op1);
        registrarOperador(op2);
    }
}
