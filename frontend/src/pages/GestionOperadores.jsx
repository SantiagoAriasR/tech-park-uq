import { useState, useEffect, useCallback } from "react"
import { getOperadores, crearOperador,
         actualizarOperador, eliminarOperador } from "../services/operadorAdminService"
import { getZonas } from "../services/zonaService"
import "./GestionOperadores.css"

const FORM_VACIO = {
    nombre: "",
    documento: "",
    email: "",
    contrasena: "",
    zonaAsignada: ""
}

function GestionOperadores() {
    const [operadores, setOperadores] = useState([])
    const [zonas, setZonas] = useState([])
    const [form, setForm] = useState(FORM_VACIO)
    const [editando, setEditando] = useState(null)
    const [mostrarForm, setMostrarForm] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [confirmEliminar, setConfirmEliminar] = useState(null)
    const [busqueda, setBusqueda] = useState("")

    function mostrarMensaje(tipo, texto) {
        setMensaje({ tipo, texto })
        setTimeout(() => setMensaje(null), 3000)
    }

    const cargarDatos = useCallback(async () => {
        try {
            const [ops, zon] = await Promise.all([getOperadores(), getZonas()])
            setOperadores(ops)
            setZonas(zon)
        } catch {
            mostrarMensaje("error", "Error al cargar datos")
        } finally {
            setCargando(false)
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarDatos()
    }, [cargarDatos])

    function handleEditar(op) {
        setEditando(op.documento)
        setForm({
            nombre: op.nombre,
            documento: op.documento,
            email: op.email,
            contrasena: "",
            zonaAsignada: op.zonaAsignada
        })
        setMostrarForm(true)
    }

    function handleNuevo() {
        setEditando(null)
        setForm(FORM_VACIO)
        setMostrarForm(true)
    }

    function handleCancelar() {
        setEditando(null)
        setForm(FORM_VACIO)
        setMostrarForm(false)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            let resultado
            if (editando) {
                resultado = await actualizarOperador(editando, {
                    nombre: form.nombre,
                    email: form.email,
                    zonaAsignada: form.zonaAsignada
                })
            } else {
                resultado = await crearOperador(form)
            }
            if (resultado.exito) {
                mostrarMensaje("exito", resultado.mensaje)
                handleCancelar()
                cargarDatos()
            } else {
                mostrarMensaje("error", resultado.mensaje)
            }
        } catch {
            mostrarMensaje("error", "Error al guardar operador")
        }
    }

    async function handleEliminar(documento) {
        try {
            const resultado = await eliminarOperador(documento)
            if (resultado.exito) {
                mostrarMensaje("exito", resultado.mensaje)
                setConfirmEliminar(null)
                cargarDatos()
            } else {
                mostrarMensaje("error", resultado.mensaje)
            }
        } catch {
            mostrarMensaje("error", "Error al eliminar operador")
        }
    }

    const operadoresFiltrados = operadores.filter(op =>
        op.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        op.documento.includes(busqueda) ||
        op.zonaAsignada.toLowerCase().includes(busqueda.toLowerCase())
    )

    if (cargando) return <div className="cargando">Cargando operadores...</div>

    return (
        <div className="gestion-operadores">
            <div className="go-header">
                <h2>👷 Gestión de Operadores</h2>
                <button className="btn-nuevo" onClick={handleNuevo}>
                    + Nuevo operador
                </button>
            </div>

            {mensaje && (
                <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
            )}

            {/* Formulario */}
            {mostrarForm && (
                <div className="go-form-container">
                    <h3>{editando ? "Editar operador" : "Nuevo operador"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nombre completo</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Pedro Ramírez"
                                    value={form.nombre}
                                    onChange={e => setForm({
                                        ...form, nombre: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            {!editando && (
                                <div className="form-group">
                                    <label>Documento</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: 333333"
                                        value={form.documento}
                                        onChange={e => setForm({
                                            ...form, documento: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="operador@techpark.com"
                                    value={form.email}
                                    onChange={e => setForm({
                                        ...form, email: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            {!editando && (
                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={form.contrasena}
                                        onChange={e => setForm({
                                            ...form, contrasena: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Zona asignada</label>
                                <select
                                    value={form.zonaAsignada}
                                    onChange={e => setForm({
                                        ...form, zonaAsignada: e.target.value
                                    })}
                                    required
                                >
                                    <option value="">Selecciona una zona</option>
                                    {zonas.map((z, i) => (
                                        <option key={i} value={z.nombre}>
                                            {z.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-botones">
                            <button type="submit" className="btn-guardar">
                                {editando ? "Guardar cambios" : "Crear operador"}
                            </button>
                            <button type="button"
                                className="btn-cancelar" onClick={handleCancelar}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Buscador */}
            {!mostrarForm && (
                <div className="buscador">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, documento o zona..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>
            )}

            {/* Tabla */}
            {!mostrarForm && (
                <div className="tabla-container">
                    <table className="tabla-operadores">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Documento</th>
                                <th>Email</th>
                                <th>Zona asignada</th>
                                <th>Disponible</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operadoresFiltrados.map((op, i) => (
                                <tr key={i}>
                                    <td><strong>{op.nombre}</strong></td>
                                    <td>{op.documento}</td>
                                    <td>{op.email}</td>
                                    <td>{op.zonaAsignada}</td>
                                    <td>
                                        <span className={`badge-disponible ${op.disponible ? "si" : "no"}`}>
                                            {op.disponible ? "✅ Sí" : "❌ No"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="acciones">
                                            <button
                                                className="btn-editar"
                                                onClick={() => handleEditar(op)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-eliminar"
                                                onClick={() => setConfirmEliminar(op.documento)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {operadoresFiltrados.length === 0 && (
                        <div className="tabla-vacia">
                            No se encontraron operadores
                        </div>
                    )}
                </div>
            )}

            {/* Modal confirmar eliminar */}
            {confirmEliminar && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>⚠️ Confirmar eliminación</h3>
                        <p>¿Eliminar al operador con documento
                            <strong> {confirmEliminar}</strong>?
                        </p>
                        <p className="modal-advertencia">
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="modal-botones">
                            <button
                                className="btn-confirmar-eliminar"
                                onClick={() => handleEliminar(confirmEliminar)}
                            >
                                Sí, eliminar
                            </button>
                            <button
                                className="btn-cancelar-modal"
                                onClick={() => setConfirmEliminar(null)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GestionOperadores