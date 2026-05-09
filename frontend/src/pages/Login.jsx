import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../services/authService"
import { useAuth } from "../context/AuthContext"
import "./Login.css"

function Login() {
    const [email, setEmail] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [error, setError] = useState(null)
    const [cargando, setCargando] = useState(false)

    const { iniciarSesion } = useAuth()
    const navigate = useNavigate()

    async function manejarLogin(e) {
        e.preventDefault()
        setCargando(true)
        setError(null)

        try {
            const resultado = await login(email, contrasena)
            if (resultado.exito) {
                iniciarSesion(resultado) // guarda la sesión en el contexto
                // Redirige según el rol
                switch (resultado.rol) {
                    case "VISITANTE":
                        navigate("/visitante")
                        break
                    case "OPERADOR":
                        navigate("/operador")
                        break
                    case "ADMINISTRADOR":
                        navigate("/admin")
                        break
                    default:
                        navigate("/")
                }
            } else {
                setError(resultado.mensaje)
            }
        } catch {
            setError("Error al conectar con el servidor")
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>🎢 Tech-Park UQ</h1>
                    <p>Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={manejarLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={contrasena}
                            onChange={e => setContrasena(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="login-error">
                            ❌ {error}
                        </div>
                    )}

                    <button type="submit" className="btn-login" disabled={cargando}>
                        {cargando ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>

                {/* Credenciales de prueba */}
                <div className="credenciales-prueba">
                    <p>Credenciales de prueba:</p>
                    <div className="cred-item" onClick={() => {
                        setEmail("carlos@email.com")
                        setContrasena("1234")
                    }}>
                        <span className="cred-rol visitante">VISITANTE</span>
                        <span>carlos@email.com / 1234</span>
                    </div>
                    <div className="cred-item" onClick={() => {
                        setEmail("juan@techpark.com")
                        setContrasena("op123")
                    }}>
                        <span className="cred-rol operador">OPERADOR</span>
                        <span>juan@techpark.com / op123</span>
                    </div>
                    <div className="cred-item" onClick={() => {
                        setEmail("admin@techpark.com")
                        setContrasena("admin123")
                    }}>
                        <span className="cred-rol admin">ADMIN</span>
                        <span>admin@techpark.com / admin123</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login