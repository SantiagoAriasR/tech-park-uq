import { useState, useEffect, useCallback } from "react"
import { getZonas, getZona, crearZona,
         actualizarZona, eliminarZona } from "../services/zonaService"
import "./GestionZonas.css"

const FORM_VACIO = { id: "", nombre: "", capacidadMax: "" }

function GestionZonas() {
    const [zonas, setZonas] = useState([])
    const [zonaDetalle, setZonaDetalle] = useState(null)
    const [form, setForm] = useState(FORM_VACIO)
    const [editando, setEditando] = useState(null) // nombre de la zona que se edita
    const [mostrarForm, setMostrarForm] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [confirmEliminar, setConfirmEliminar] = useState(null)

    function mostrarMensaje(tipo, texto) {
        setMensaje({ tipo, texto })
        setTimeout(() => setMensaje(null), 3000)
    }

    const cargarZonas = useCallback(async () => {
        try {
            const data = await getZonas()
            setZonas(data)
        } catch {
            mostrarMensaje("error", "Error al cargar zonas")
        } finally {
            setCargando(false)
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarZonas()
    }, [cargarZonas])

    async function handleVerDetalle(nombre) {
        try {
            const data = await getZona(nombre)
            if (data.exito) setZonaDetalle(data)
        } catch {
            mostrarMensaje("error", "Error al cargar detalle")
        }
    }

    function handleEditar(zona) {
        setEditando(zona.nombre)
        setForm({
            id: zona.id,
            nombre: zona.nombre,
            capacidadMax: zona.capacidadMax
        })
        setMostrarForm(true)
        setZonaDetalle(null)
    }

    function handleNuevaZona() {
        setEditando(null)
        setForm(FORM_VACIO)
        setMostrarForm(true)
        setZonaDetalle(null)
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
                resultado = await actualizarZona(editando, {
                    nuevoNombre: form.nombre,
                    capacidadMax: parseInt(form.capacidadMax)
                })
            } else {
                resultado = await crearZona({
                    id: form.id,
                    nombre: form.nombre,
                    capacidadMax: parseInt(form.capacidadMax)
                })
            }

            if (resultado.exito) {
                mostrarMensaje("exito", resultado.mensaje)
                handleCancelar()
                cargarZonas()
            } else {
                mostrarMensaje("error", resultado.mensaje)
            }
        } catch {
            mostrarMensaje("error", "Error al guardar la zona")
        }
    }

    async function handleEliminar(nombre) {
        try {
            const resultado = await eliminarZona(nombre)
            if (resultado.exito) {
                mostrarMensaje("exito", resultado.mensaje)
                setConfirmEliminar(null)
                setZonaDetalle(null)
                cargarZonas()
            } else {
                mostrarMensaje("error", resultado.mensaje)
            }
        } catch {
            mostrarMensaje("error", "Error al eliminar la zona")
        }
    }

    if (cargando) return <div className="cargando">Cargando zonas...</div>

    return (
        <div className="gestion-zonas">
            <div className="gz-header">
                <h2>🏗️ Gestión de Zonas</h2>
                <button className="btn-nueva-zona" onClick={handleNuevaZona}>
                    + Nueva zona
                </button>
            </div>

            {mensaje && (
                <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
            )}

            <div className="gz-layout">

                {/* Lista de zonas */}
                <div className="gz-lista">
                    <h3>Zonas del parque ({zonas.length})</h3>
                    {zonas.map((zona, i) => (
                        <div
                            key={i}
                            className={`zona-item ${zonaDetalle?.nombre === zona.nombre ? "seleccionada" : ""}`}
                            onClick={() => handleVerDetalle(zona.nombre)}
                        >
                            <div className="zona-item-info">
                                <h4>{zona.nombre}</h4>
                                <div className="zona-item-stats">
                                    <span>🎢 {zona.totalAtracciones} atracciones</span>
                                    <span>✅ {zona.atraccionesActivas} activas</span>
                                    <span>👷 {zona.totalOperadores} operadores</span>
                                    <span>👥 Cap: {zona.capacidadMax}</span>
                                </div>
                            </div>
                            <div className="zona-item-acciones">
                                <button
                                    className="btn-editar"
                                    onClick={e => {
                                        e.stopPropagation()
                                        handleEditar(zona)
                                    }}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn-eliminar"
                                    onClick={e => {
                                        e.stopPropagation()
                                        setConfirmEliminar(zona.nombre)
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Panel derecho — detalle o formulario */}
                <div className="gz-panel">

                    {/* Formulario crear/editar */}
                    {mostrarForm && (
                        <div className="gz-form-container">
                            <h3>{editando ? "Editar zona" : "Nueva zona"}</h3>
                            <form onSubmit={handleSubmit}>
                                {!editando && (
                                    <div className="form-group">
                                        <label>ID de la zona</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Z3"
                                            value={form.id}
                                            onChange={e => setForm({
                                                ...form, id: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Zona Infantil"
                                        value={form.nombre}
                                        onChange={e => setForm({
                                            ...form, nombre: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Capacidad máxima</label>
                                    <input
                                        type="number"
                                        placeholder="Ej: 80"
                                        value={form.capacidadMax}
                                        onChange={e => setForm({
                                            ...form, capacidadMax: e.target.value
                                        })}
                                        required
                                        min="1"
                                    />
                                </div>
                                <div className="form-botones">
                                    <button type="submit" className="btn-guardar">
                                        {editando ? "Guardar cambios" : "Crear zona"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-cancelar"
                                        onClick={handleCancelar}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Detalle de zona */}
                    {zonaDetalle && !mostrarForm && (
                        <div className="gz-detalle">
                            <h3>📍 {zonaDetalle.nombre}</h3>
                            <div className="detalle-stats">
                                <div className="det-stat">
                                    <span className="det-num">{zonaDetalle.capacidadMax}</span>
                                    <span className="det-label">Capacidad máx</span>
                                </div>
                                <div className="det-stat">
                                    <span className="det-num">{zonaDetalle.totalAtracciones}</span>
                                    <span className="det-label">Atracciones</span>
                                </div>
                                <div className="det-stat">
                                    <span className="det-num">{zonaDetalle.atraccionesActivas}</span>
                                    <span className="det-label">Activas</span>
                                </div>
                            </div>

                            <h4>Atracciones</h4>
                            {zonaDetalle.atracciones.length > 0 ? (
                                <div className="detalle-lista">
                                    {zonaDetalle.atracciones.map((a, i) => (
                                        <div key={i} className="detalle-item">
                                            <span>{a.nombre}</span>
                                            <span className={`estado-badge ${a.estado.toLowerCase()}`}>
                                                {a.estado}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="sin-datos">Sin atracciones asignadas</p>
                            )}

                            <h4>Operadores</h4>
                            {zonaDetalle.operadores.length > 0 ? (
                                <div className="detalle-lista">
                                    {zonaDetalle.operadores.map((op, i) => (
                                        <div key={i} className="detalle-item">
                                            <span>👷 {op}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="sin-datos">Sin operadores asignados</p>
                            )}
                        </div>
                    )}

                    {/* Estado vacío */}
                    {!mostrarForm && !zonaDetalle && (
                        <div className="gz-vacio">
                            <p>👈 Selecciona una zona para ver su detalle</p>
                            <p>o crea una nueva con el botón de arriba</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal confirmación eliminar */}
            {confirmEliminar && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>⚠️ Confirmar eliminación</h3>
                        <p>¿Estás seguro de eliminar la zona
                            <strong> {confirmEliminar}</strong>?
                        </p>
                        <p className="modal-advertencia">
                            Esta acción no se puede deshacer y eliminará
                            todas las atracciones asociadas.
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

export default GestionZonas