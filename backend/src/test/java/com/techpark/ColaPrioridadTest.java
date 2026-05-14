package com.techpark;

import com.techpark.estructuras.ColaPrioridad;
import com.techpark.model.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

public class ColaPrioridadTest {

    @Test
    @DisplayName("FastPass tiene prioridad sobre ticket General")
    void fastPassTienePrioridadSobreGeneral() {
        ColaPrioridad cola = new ColaPrioridad();

        Visitante visitante1 = new Visitante("V1", "Carlos", "123",
            "carlos@email.com", "1234", 25, 150000, 1.75);
        Visitante visitante2 = new Visitante("V2", "Ana", "456",
            "ana@email.com", "1234", 22, 100000, 1.60);

        Ticket ticketGeneral = new TicketGeneral("T1", visitante1);
        Ticket ticketFastPass = new TicketFastPass("T2", visitante2);

        // Encolar primero el General, luego el FastPass
        cola.encolar(ticketGeneral);
        cola.encolar(ticketFastPass);

        // El primero en salir debe ser el FastPass
        Ticket primero = cola.desencolar();
        assertEquals("TicketFastPass", primero.getClass().getSimpleName(),
            "FastPass debe salir antes que General");
    }

    @Test
    @DisplayName("Cola vacia retorna null al desencolar")
    void colaVaciaRetornaNull() {
        ColaPrioridad cola = new ColaPrioridad();
        assertNull(cola.desencolar(),
            "Cola vacia debe retornar null");
    }

    @Test
    @DisplayName("Tamanio de cola se actualiza correctamente")
    void tamanioSeActualizaCorrectamente() {
        ColaPrioridad cola = new ColaPrioridad();
        Visitante visitante = new Visitante("V1", "Carlos", "123",
            "carlos@email.com", "1234", 25, 150000, 1.75);

        assertEquals(0, cola.getTamanio(), "Cola debe iniciar vacia");

        cola.encolar(new TicketGeneral("T1", visitante));
        cola.encolar(new TicketGeneral("T2", visitante));
        assertEquals(2, cola.getTamanio(), "Cola debe tener 2 elementos");

        cola.desencolar();
        assertEquals(1, cola.getTamanio(), "Cola debe tener 1 elemento");
    }
}
