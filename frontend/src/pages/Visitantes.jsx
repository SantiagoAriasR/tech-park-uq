import { useState, useEffect } from "react"
import { getVisitantes, registrarVisitante } from "../services/visitanteService"
import "./Visitantes.css"

function Visitantes() {
    const [visitantes, setVisitantes] = useState([])
    const [cargando, setCargando] = useState(true)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [mensaje, setMensaje] = useState(null)

    const [form, setForm] = useState({
        id: "",
        nombre: "",
        documento: "",
        email: "",
        contrasena: "",
        edad: "",
        saldo: "",
        estatura: ""
    })

    useEffect(() => {
        cargarVisitantes()
    }, [])

    async function cargarVisitantes() {
        try {
            const data = await getVisitantes()
            setVisitantes(data)
        } catch (error) {
            console.error("Error al cargar visitantes:", error)
        } finally {
            setCargando(false)
        }
    }

    function manejarCambio(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function manejarEnvio(e) {
        e.preventDefault()
        const nuevoVisitante = {
            ...form,
            id: "V-" + Date.now(),
            edad: parseInt(form.edad),
            saldo: parseFloat(form.saldo),
            estatura: parseFloat(form.estatura)
        }
        try {
            const resultado = await registrarVisitante(nuevoVisitante)
            if (resultado.exito) {
                setMensaje({ tipo: "exito", texto: "Visitante registrado correctamente" })
                setMostrarFormulario(false)
                setForm({ id: "", nombre: "", documento: "", email: "",
                          contrasena: "", edad: "", saldo: "", estatura: "" })
                cargarVisitantes()
            } else {
                setMensaje({ tipo: "error", texto: resultado.mensaje })
            }
        } catch {
            setMensaje({ tipo: "error", texto: "Error al conectar con el servidor" })
        }
        setTimeout(() => setMensaje(null), 3000)
    }

    if (cargando) return <div className="cargando">Cargando visitantes...</div>

    return (
        <div className="visitantes">
            <div className="visitantes-header">
                <h2>👥 Visitantes registrados</h2>
                <button
                    className="btn-agregar"
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                    {mostrarFormulario ? "Cancelar" : "+ Nuevo visitante"}
                </button>
            </div>

            {/* Mensaje de éxito o error */}
            {mensaje && (
                <div className={`mensaje ${mensaje.tipo}`}>
                    {mensaje.texto}
                </div>
            )}

            {/* Formulario de registro */}
            {mostrarFormulario && (
                <form className="formulario-visitante" onSubmit={manejarEnvio}>
                    <h3>Registrar nuevo visitante</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nombre completo</label>
                            <input name="nombre" value={form.nombre}
                                onChange={manejarCambio} required />
                        </div>
                        <div className="form-group">
                            <label>Documento</label>
                            <input name="documento" value={form.documento}
                                onChange={manejarCambio} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={form.email}
                                onChange={manejarCambio} required />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input type="password" name="contrasena" value={form.contrasena}
                                onChange={manejarCambio} required />
                        </div>
                        <div className="form-group">
                            <label>Edad</label>
                            <input type="number" name="edad" value={form.edad}
                                onChange={manejarCambio} required />
                        </div>
                        <div className="form-group">
                            <label>Saldo ($)</label>
                            <input type="number" name="saldo" value={form.saldo}
                                onChange={manejarCambio} required />
                        </div>
                        <div className="form-group">
                            <label>Estatura (metros)</label>
                            <input type="number" step="0.01" name="estatura"
                                value={form.estatura} onChange={manejarCambio} required />
                        </div>
                    </div>
                    <button type="submit" className="btn-submit">
                        Registrar visitante
                    </button>
                </form>
            )}

            {/* Tabla de visitantes */}
            <div className="tabla-container">
                <table className="tabla-visitantes">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Documento</th>
                            <th>Email</th>
                            <th>Edad</th>
                            <th>Estatura</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitantes.map((v, index) => (
                            <tr key={index}>
                                <td>{v.nombre}</td>
                                <td>{v.documento}</td>
                                <td>{v.email}</td>
                                <td>{v.edad} años</td>
                                <td>{v.estatura} m</td>
                                <td>${v.saldo?.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Visitantes