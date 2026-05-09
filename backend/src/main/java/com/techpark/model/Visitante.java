package com.techpark.model;

public class Visitante extends Usuario {

    private int edad;
    private double saldo;
    private double estatura; // en metros, para validar restricciones de atracciones

    // Constructor
    public Visitante(String id, String nombre, String documento,
                     String email, String contrasena,
                     int edad, double saldo, double estatura) {
        super(id, nombre, documento, email, contrasena); // llama al constructor de Usuario
        this.edad = edad;
        this.saldo = saldo;
        this.estatura = estatura;
    }

    // Implementación obligatoria del método abstracto
    @Override
    public String getTipoUsuario() {
        return "VISITANTE";
    }

    // Método propio del visitante: descontar saldo al comprar ticket
    public boolean descontarSaldo(double monto) {
        if (saldo >= monto) {
            saldo -= monto;
            return true; // pago exitoso
        }
        return false; // saldo insuficiente
    }

    // Getters
    public int getEdad() { return edad; }
    public double getSaldo() { return saldo; }
    public double getEstatura() { return estatura; }

    // Setters
    public void setEdad(int edad) { this.edad = edad; }
    public void setSaldo(double saldo) { this.saldo = saldo; }
    public void setEstatura(double estatura) { this.estatura = estatura; }

    @Override
    public String toString() {
        return super.toString() + " | Edad: " + edad + " | Saldo: $" + saldo;
    }
}
