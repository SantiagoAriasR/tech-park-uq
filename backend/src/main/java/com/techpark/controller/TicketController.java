package com.techpark.controller;

import com.techpark.model.Ticket;
import com.techpark.service.ParqueService;
import com.techpark.estructuras.ColaPrioridad;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final ParqueService parqueService;

    public TicketController(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // POST /api/tickets/comprar — comprar un ticket
    // Body esperado: { "documento": "123456", "tipo": "GENERAL", "atraccion": "Montaña Rusa Extrema" }
    @PostMapping("/comprar")
    public Map<String, Object> comprar(@RequestBody Map<String, String> body) {
        String documento = body.get("documento");
        String tipo = body.get("tipo");
        String atraccion = body.get("atraccion");

        boolean exito = parqueService.comprarTicket(documento, tipo, atraccion);
        return Map.of(
            "exito", exito,
            "mensaje", exito
                ? "Ticket comprado y encolado correctamente"
                : "No se pudo comprar el ticket. Verifica saldo, requisitos o disponibilidad"
        );
    }

    // GET /api/tickets/cola/{atraccion} — ver la cola de una atracción
    @GetMapping("/cola/{atraccion}")
    public Map<String, Object> verCola(@PathVariable String atraccion) {
        ColaPrioridad cola = parqueService.obtenerColaDeAtraccion(atraccion);
        return Map.of(
            "atraccion", atraccion,
            "personasEnCola", cola.getTamanio(),
            "proximoEnEntrar", cola.estaVacia()
                ? "Cola vacía"
                : cola.verPrimero().getVisitante().getNombre()
        );
    }

    // DELETE /api/tickets/cola/{atraccion}/siguiente — dejar pasar al siguiente
    @DeleteMapping("/cola/{atraccion}/siguiente")
    public Map<String, Object> dejarPasar(@PathVariable String atraccion) {
        ColaPrioridad cola = parqueService.obtenerColaDeAtraccion(atraccion);
        Ticket ticket = cola.desencolar();
        if (ticket != null) {
            ticket.canjear();
            return Map.of(
                "exito", true,
                "visitante", ticket.getVisitante().getNombre(),
                "tipoTicket", ticket.getClass().getSimpleName()
            );
        }
        return Map.of("exito", false, "mensaje", "La cola está vacía");
    }
}
