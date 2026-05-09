package com.techpark.service;

import com.techpark.model.*;
import com.techpark.estructuras.Nodo;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final ParqueService parqueService;

    public AuthService(ParqueService parqueService) {
        this.parqueService = parqueService;
    }

    // Busca el usuario en todas las listas y valida la contraseña
    public Usuario autenticar(String email, String contrasena) {

        // Buscar en visitantes
        Nodo<Visitante> nodoVisitante = parqueService.getListaVisitantes().getCabeza();
        while (nodoVisitante != null) {
            Visitante v = nodoVisitante.dato;
            if (v.getEmail().equals(email) && v.getContrasena().equals(contrasena)) {
                return v;
            }
            nodoVisitante = nodoVisitante.siguiente;
        }

        // Buscar en operadores
        Nodo<Operador> nodoOperador = parqueService.getListaOperadores().getCabeza();
        while (nodoOperador != null) {
            Operador o = nodoOperador.dato;
            if (o.getEmail().equals(email) && o.getContrasena().equals(contrasena)) {
                return o;
            }
            nodoOperador = nodoOperador.siguiente;
        }

        // Buscar en administradores
        Nodo<Administrador> nodoAdmin = parqueService.getListaAdministradores().getCabeza();
        while (nodoAdmin != null) {
            Administrador a = nodoAdmin.dato;
            if (a.getEmail().equals(email) && a.getContrasena().equals(contrasena)) {
                return a;
            }
            nodoAdmin = nodoAdmin.siguiente;
        }

        return null; // no encontrado
    }
}
