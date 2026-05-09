package com.techpark.model;

public abstract class Usuario {

    // Atributos comunes a todo tipo de usuario
    private String id;
    private String nombre;
    private String documento;
    private String email;
    private String contrasena;

    // Constructor
    public Usuario(String id, String nombre, String documento, 
                   String email, String contrasena) {
        this.id = id;
        this.nombre = nombre;
        this.documento = documento;
        this.email = email;
        this.contrasena = contrasena;
    }

    // Método abstracto: cada tipo de usuario lo implementa diferente
    public abstract String getTipoUsuario();

    // Getters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDocumento() { return documento; }
    public String getEmail() { return email; }
    public String getContrasena() { return contrasena; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDocumento(String documento) { this.documento = documento; }
    public void setEmail(String email) { this.email = email; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    // Representación en texto del objeto
    @Override
    public String toString() {
        return "[" + getTipoUsuario() + "] " + nombre + " - Doc: " + documento;
    }
}