import { createContext, useContext, useState } from "react"

// Crear el contexto
const AuthContext = createContext(null)

// Proveedor — envuelve toda la app y comparte la sesión
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null) // null = no hay sesión

    function iniciarSesion(datosUsuario) {
        setUsuario(datosUsuario)
    }

    function cerrarSesion() {
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
    return useContext(AuthContext)
}