import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registrarVisitante } from "../services/visitanteService"
import "./Registro.css"

function Registro() {
    const navigate = useNavigate()
    const [mensaje, setMensaje] = useState(null)
    const [form, setForm] = useState({
        nombre: "",
        documento: "",
        email: "",
        contrasena: "",
        edad: "",
        saldo: "",
        estatura: ""
    })

    function manejarCambio(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function manejarEnvio(e) {
        e.preventDefault()
        try {
            const resultado = await registrarVisitante({
                id: "V-" + Date.now(),
                nombre: form.nombre,
                documento: form.documento,
                email: form.email,
                contrasena: form.contrasena,
                edad: parseInt(form.edad),
                saldo: parseFloat(form.saldo),
                estatura: parseFloat(form.estatura)
            })
            if (resultado.exito) {
                setMensaje({ tipo: "exito", texto: "¡Cuenta creada! Redirigiendo al login..." })
                setTimeout(() => navigate("/login"), 2000)
            } else {
                setMensaje({ tipo: "error", texto: resultado.mensaje })
            }
        } catch {
            setMensaje({ tipo: "error", texto: "Error al conectar con el servidor" })
        }
    }

    return (
        <div className="registro-container">
            <div className="registro-card">
                <div className="registro-header">
                    <h1>🎢 Tech-Park UQ</h1>
                    <p>Crea tu cuenta de visitante</p>
                </div>

                {mensaje && (
                    <div className={`registro-mensaje ${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nombre completo</label>
                            <input
                                name="nombre"
                                type="text"
                                placeholder="Ej: Juan García"
                                value={form.nombre}
                                onChange={manejarCambio}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Documento</label>
                            <input
                                name="documento"
                                type="text"
                                placeholder="Ej: 1234567890"
                                value={form.documento}
                                onChange={manejarCambio}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={form.email}
                                onChange={manejarCambio}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                name="contrasena"
                                type="password"
                                placeholder="••••••••"
                                value={form.contrasena}
                                onChange={manejarCambio}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Edad</label>
                            <input
                                name="edad"
                                type="number"
                                min="1"
                                placeholder="Ej: 25"
                                value={form.edad}
                                onChange={manejarCambio}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Saldo inicial ($)</label>
                            <input
                                name="saldo"
                                type="number"
                                min="0"
                                placeholder="Ej: 100000"
                                value={form.saldo}
                                onChange={manejarCambio}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Estatura (metros)</label>
                            <input
                                name="estatura"
                                type="number"
                                step="0.01"
                                min="0.5"
                                placeholder="Ej: 1.75"
                                value={form.estatura}
                                onChange={manejarCambio}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-registro">
                        Crear cuenta
                    </button>
                </form>

                <div className="registro-footer">
                    <p>¿Ya tienes cuenta?{" "}
                        <Link to="/login" className="link-login">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Registro