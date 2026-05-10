package com.techpark.service;

import com.techpark.model.*;
import com.techpark.estructuras.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service // le dice a Spring Boot que esta clase es un servicio administrado por él
public class ParqueService {

    // El parque es único — patrón Singleton implícito
    private Parque parque;

    // Estructuras de datos propias
    private ArbolBinarioBusqueda arbolAtracciones;
    private ListaEnlazada<Visitante> listaVisitantes;
    private ListaEnlazada<Operador> listaOperadores;
    private ListaEnlazada<Administrador> listaAdministradores;
    private AlertaClimatica alertaActual;
    private int cierresPorClima;
    private int alertasMantenimiento;
    private int totalTicketsVendidos;
    private double ingresosTotales;
    private GrafoParque grafoParque;

    // Constructor — inicializa el parque con datos base
    public ParqueService() {
        this.parque = new Parque("Tech-Park UQ", 500);
        this.arbolAtracciones = new ArbolBinarioBusqueda();
        this.listaVisitantes = new ListaEnlazada<>();
        this.listaOperadores = new ListaEnlazada<>();
        this.listaAdministradores = new ListaEnlazada<>();
        this.alertaActual = null;
        this.cierresPorClima = 0;
        this.alertasMantenimiento = 0;
        this.totalTicketsVendidos = 0;
        this.ingresosTotales = 0.0;
        this.grafoParque = new GrafoParque();
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
    // ADMINISTRADORES
    //

    public void registrarAdministrador(Administrador administrador) {
        listaAdministradores.agregar(administrador);
    }

    public ListaEnlazada<Administrador> getListaAdministradores() {
        return listaAdministradores;
    }

    // ─────────────────────────────────────────
    // TICKETS Y COLA
    // ─────────────────────────────────────────

    public boolean comprarTicket(String documento, String tipoTicket, String nombreAtraccion) {
        Visitante visitante = buscarVisitante(documento);
        Atraccion atraccion = buscarAtraccionPorNombre(nombreAtraccion);

        if (visitante == null || atraccion == null)
            return false;
        if (!atraccion.estaDisponible())
            return false;
        if (!atraccion.visitanteCumpleRequisitos(visitante))
            return false;

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
            totalTicketsVendidos++;
            ingresosTotales += ticket.getPrecio();
            visitante.agregarAlHistorial(nombreAtraccion); // registra en historial
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
        colasDeAtracciones.agregar(new Object[] { nombreAtraccion, nuevaCola });
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
    // ALERTAS CLIMÁTICAS
    // ─────────────────────────────────────────

    public Map<String, Object> activarAlertaClimatica(
            AlertaClimatica.TipoAlerta tipo, String descripcion) {

        this.alertaActual = new AlertaClimatica(tipo, descripcion);
        int atraccionesCerradas = 0;

        // Cerrar atracciones según el tipo de alerta
        for (Zona zona : parque.getZonas()) {
            for (Atraccion atraccion : zona.getAtracciones()) {
                boolean debecerrarse = false;

                if (tipo == AlertaClimatica.TipoAlerta.TORMENTA_ELECTRICA) {
                    // Cierra todas las atracciones
                    debecerrarse = true;
                } else if (tipo == AlertaClimatica.TipoAlerta.LLUVIA_FUERTE) {
                    // Solo cierra acuáticas y mecánicas
                    debecerrarse = atraccion instanceof AtraccionAcuatica
                            || atraccion instanceof AtraccionMecanica;
                }

                if (debecerrarse && atraccion.estaDisponible()) {
                    atraccion.cambiarEstado(EstadoAtraccion.CERRADA);
                    atraccionesCerradas++;
                    cierresPorClima++;
                }
            }
        }

        return Map.of(
                "exito", true,
                "tipo", tipo.toString(),
                "atraccionesCerradas", atraccionesCerradas,
                "mensaje", "Alerta activada: " + descripcion);
    }

    public Map<String, Object> desactivarAlerta() {
        if (alertaActual == null) {
            return Map.of("exito", false, "mensaje", "No hay alerta activa");
        }
        alertaActual.setActiva(false);

        // Reactivar atracciones que estaban cerradas por clima
        int atraccionesReactivadas = 0;
        for (Zona zona : parque.getZonas()) {
            for (Atraccion atraccion : zona.getAtracciones()) {
                if (atraccion.getEstado() == EstadoAtraccion.CERRADA) {
                    atraccion.cambiarEstado(EstadoAtraccion.ACTIVA);
                    atraccionesReactivadas++;
                }
            }
        }

        this.alertaActual = null;
        return Map.of(
                "exito", true,
                "atraccionesReactivadas", atraccionesReactivadas,
                "mensaje", "Alerta desactivada. Atracciones reactivadas.");
    }

    public AlertaClimatica getAlertaActual() {
        return alertaActual;
    }

    // ─────────────────────────────────────────
    // CRUD DE ATRACCIONES
    // ─────────────────────────────────────────

    public boolean crearAtraccionMecanica(String id, String nombre, int capacidad,
            double alturaMinima, int edadMinima, double costoExtra,
            double velocidadMax, String nombreZona) {
        if (arbolAtracciones.buscar(nombre) != null)
            return false;
        AtraccionMecanica nueva = new AtraccionMecanica(
                id, nombre, capacidad, alturaMinima, edadMinima, costoExtra, velocidadMax);
        agregarAtraccion(nueva, nombreZona);
        return true;
    }

    public boolean crearAtraccionAcuatica(String id, String nombre, int capacidad,
            double alturaMinima, int edadMinima, double costoExtra,
            double profundidad, String nombreZona) {
        if (arbolAtracciones.buscar(nombre) != null)
            return false;
        AtraccionAcuatica nueva = new AtraccionAcuatica(
                id, nombre, capacidad, alturaMinima, edadMinima, costoExtra, profundidad);
        agregarAtraccion(nueva, nombreZona);
        return true;
    }

    public boolean eliminarAtraccion(String nombre) {
        // Eliminar de todas las zonas
        for (Zona zona : parque.getZonas()) {
            zona.getAtracciones().removeIf(
                    a -> a.getNombre().equalsIgnoreCase(nombre));
        }
        // No podemos eliminar del ABB directamente sin reimplementarlo
        // marcamos como CERRADA en su lugar
        Atraccion atraccion = arbolAtracciones.buscar(nombre);
        if (atraccion != null) {
            atraccion.cambiarEstado(EstadoAtraccion.CERRADA);
            return true;
        }
        return false;
    }

    public boolean actualizarAtraccion(String nombre, int capacidad,
            double alturaMinima, int edadMinima, double costoExtra) {
        Atraccion atraccion = arbolAtracciones.buscar(nombre);
        if (atraccion == null)
            return false;
        atraccion.setCapacidad(capacidad);
        atraccion.setAlturaMinima(alturaMinima);
        atraccion.setEdadMinima(edadMinima);
        atraccion.setCostoExtra(costoExtra);
        return true;
    }

    // ─────────────────────────────────────────
    // ASIGNACIONES
    // ─────────────────────────────────────────

    public boolean asignarAtraccionAZona(String nombreAtraccion, String nombreZona) {
        Atraccion atraccion = arbolAtracciones.buscar(nombreAtraccion);
        Zona zona = parque.buscarZona(nombreZona);
        if (atraccion == null || zona == null)
            return false;

        // Verificar que no esté ya en esa zona
        for (Atraccion a : zona.getAtracciones()) {
            if (a.getNombre().equalsIgnoreCase(nombreAtraccion))
                return false;
        }
        zona.agregarAtraccion(atraccion);
        return true;
    }

    public boolean asignarOperadorAZona(String documentoOperador, String nombreZona) {
        Operador operador = buscarOperador(documentoOperador);
        Zona zona = parque.buscarZona(nombreZona);
        if (operador == null || zona == null)
            return false;
        zona.agregarOperador(operador);
        return true;
    }

    // ─────────────────────────────────────────
    // CRUD DE ZONAS
    // ─────────────────────────────────────────

    public boolean crearZona(String id, String nombre, int capacidadMax) {
        // Verificar que no exista una zona con el mismo nombre
        if (parque.buscarZona(nombre) != null) {
            return false; // ya existe
        }
        Zona nuevaZona = new Zona(id, nombre, capacidadMax);
        parque.agregarZona(nuevaZona);
        return true;
    }

    public boolean actualizarZona(String nombre, String nuevoNombre, int nuevaCapacidad) {
        Zona zona = parque.buscarZona(nombre);
        if (zona == null)
            return false;
        zona.setNombre(nuevoNombre);
        zona.setCapacidadMax(nuevaCapacidad);
        return true;
    }

    public boolean eliminarZona(String nombre) {
        List<Zona> zonas = parque.getZonas();
        return zonas.removeIf(z -> z.getNombre().equalsIgnoreCase(nombre));
    }

    public Map<String, Object> getDetalleZona(String nombre) {
        Zona zona = parque.buscarZona(nombre);
        if (zona == null)
            return Map.of("exito", false, "mensaje", "Zona no encontrada");

        List<Map<String, Object>> atracciones = new ArrayList<>();
        for (Atraccion a : zona.getAtracciones()) {
            atracciones.add(Map.of(
                    "nombre", a.getNombre(),
                    "tipo", a.getTipo(),
                    "estado", a.getEstado().toString(),
                    "capacidad", a.getCapacidad()));
        }

        List<String> operadores = new ArrayList<>();
        for (Operador o : zona.getOperadores()) {
            operadores.add(o.getNombre());
        }

        return Map.of(
                "exito", true,
                "id", zona.getId(),
                "nombre", zona.getNombre(),
                "capacidadMax", zona.getCapacidadMax(),
                "totalAtracciones", atracciones.size(),
                "atraccionesActivas", zona.contarAtraccionesActivas(),
                "atracciones", atracciones,
                "operadores", operadores);
    }

    // ─────────────────────────────────────────
    // REPORTES
    // ─────────────────────────────────────────

    public ReporteJornada generarReporte() {
        // Top atracciones por historial de visitantes
        java.util.Map<String, Integer> conteoVisitas = new java.util.HashMap<>();

        Nodo<Visitante> nodoVisitante = listaVisitantes.getCabeza();
        while (nodoVisitante != null) {
            Visitante v = nodoVisitante.dato;
            Nodo<String> nodoHistorial = v.getHistorialVisitas().getCabeza();
            while (nodoHistorial != null) {
                String nombreAtraccion = nodoHistorial.dato;
                conteoVisitas.put(nombreAtraccion,
                        conteoVisitas.getOrDefault(nombreAtraccion, 0) + 1);
                nodoHistorial = nodoHistorial.siguiente;
            }
            nodoVisitante = nodoVisitante.siguiente;
        }

        // Ordenar top atracciones
        List<Map<String, Object>> atraccionesTop = new java.util.ArrayList<>();
        conteoVisitas.entrySet()
                .stream()
                .sorted((a, b) -> b.getValue() - a.getValue())
                .limit(5)
                .forEach(e -> {
                    java.util.Map<String, Object> item = new java.util.HashMap<>();
                    item.put("nombre", e.getKey());
                    item.put("visitas", e.getValue());
                    atraccionesTop.add(item);
                });
        return new ReporteJornada(
                LocalDate.now(),
                parque.getVisitantesActuales(),
                ingresosTotales,
                atraccionesTop,
                totalTicketsVendidos,
                cierresPorClima,
                alertasMantenimiento);
    }

    // ─────────────────────────────────────────
    // GRAFO
    // ─────────────────────────────────────────

    public Map<String, Object> calcularRutaOptima(String origen, String destino) {
        return grafoParque.dijkstra(origen, destino);
    }

    public List<String> recorridoBFS(String inicio) {
        return grafoParque.bfs(inicio);
    }

    public Map<String, Object> getEstructuraGrafo() {
        return grafoParque.getEstructura();
    }

    public GrafoParque getGrafoParque() {
        return grafoParque;
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

        // Crear administradores de prueba
        Administrador admin = new Administrador(
                "ADM1", "Director Parque", "000001",
                "admin@techpark.com", "admin123", "TOTAL");
        registrarAdministrador(admin);

        // Construir el grafo del parque
        grafoParque.agregarNodo("Entrada Principal");
        grafoParque.agregarNodo("Montaña Rusa Extrema");
        grafoParque.agregarNodo("Free Fall Tower");
        grafoParque.agregarNodo("Rapids River");
        grafoParque.agregarNodo("Splash Zone");
        grafoParque.agregarNodo("Zona Aventura");
        grafoParque.agregarNodo("Zona Acuática");
        grafoParque.agregarNodo("Restaurante Central");

        // Conexiones con distancias en metros
        grafoParque.agregarConexion("Entrada Principal", "Zona Aventura", 150);
        grafoParque.agregarConexion("Entrada Principal", "Restaurante Central", 80);
        grafoParque.agregarConexion("Zona Aventura", "Montaña Rusa Extrema", 120);
        grafoParque.agregarConexion("Zona Aventura", "Free Fall Tower", 90);
        grafoParque.agregarConexion("Zona Aventura", "Zona Acuática", 200);
        grafoParque.agregarConexion("Zona Acuática", "Rapids River", 100);
        grafoParque.agregarConexion("Zona Acuática", "Splash Zone", 80);
        grafoParque.agregarConexion("Restaurante Central", "Zona Acuática", 160);
        grafoParque.agregarConexion("Free Fall Tower", "Rapids River", 250);
    }
}
