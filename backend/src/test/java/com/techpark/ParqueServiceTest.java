package com.techpark;

import com.techpark.model.*;
import com.techpark.service.ParqueService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ParqueServiceTest {

    @Autowired
    private ParqueService parqueService;

    @Test
    @DisplayName("Visitante con saldo suficiente puede comprar ticket")
    void visitanteConSaldoPuedeComprarTicket() {
        boolean resultado = parqueService.comprarTicket(
            "123456", "GENERAL", "Splash Zone");
        assertTrue(resultado,
            "Carlos con saldo 150000 debe poder comprar ticket General de 25000");
    }

    @Test
    @DisplayName("Visitante no cumple requisitos de altura no puede comprar")
    void visitanteNoMideLoSuficienteNoPuedeComprar() {
        // Ana tiene estatura 1.60, Free Fall Tower requiere 1.50 — si pasa
        // Creamos visitante con estatura muy baja
        Visitante bajito = new Visitante("V99", "Bajito", "999999",
            "bajito@email.com", "1234", 20, 200000, 0.90);
        parqueService.registrarVisitante(bajito);

        boolean resultado = parqueService.comprarTicket(
            "999999", "GENERAL", "Montaña Rusa Extrema");
        assertFalse(resultado,
            "Visitante con 0.90m no debe poder entrar a Montaña Rusa (min 1.40m)");
    }

    @Test
    @DisplayName("Buscar visitante existente retorna el objeto correcto")
    void buscarVisitanteExistente() {
        Visitante visitante = parqueService.buscarVisitante("123456");
        assertNotNull(visitante, "Carlos debe existir en el sistema");
        assertEquals("Carlos García", visitante.getNombre());
    }

    @Test
    @DisplayName("Buscar visitante inexistente retorna null")
    void buscarVisitanteInexistente() {
        Visitante visitante = parqueService.buscarVisitante("000000");
        assertNull(visitante,
            "Documento inexistente debe retornar null");
    }
}
