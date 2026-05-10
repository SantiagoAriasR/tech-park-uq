import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../context/AuthContext"
import { getAtraccionesOperador, getColaOperador,
         validarAcceso, cambiarEstadoAtraccion } from "../services/operadorService"
import { dejarPasar } from "../services/ticketService"
import "./PanelOperador.css"

function PanelOperador() {
    const { usuario } = useAuth()
    const [zona, setZona] = useState("")
    const [atracciones, setAtracciones] = useState([])
    const [colaSeleccionada, setColaSeleccionada] = useState(null)
    const [atraccionSeleccionada, setAtraccionSeleccionada] = useState("")
    const [seccion, setSeccion] = useState("zona")
    const [mensaje, setMensaje] = useState(null)
    const [cargando, setCargando] = useState(true)

    // Form validar acceso
    const [formValidar, setFormValidar] = useState({
        documento: "",
        atraccion: ""
    })
    const [resultadoValidacion, setResultadoValidacion] = useState(null)

    // Form cambiar estado
    const [formEstado, setFormEstado] = useState({
        atraccion: "",
        estado: "ACTIVA",
        motivo: ""
    })

    function mostrarMensaje(tipo, texto) {
        setMensaje({ tipo, texto })
        setTimeout(() => setMensaje(null), 3000)
    }

    const cargarDatos = useCallback(async () => {
        try {
            const data = await getAtraccionesOperador(usuario.documento)
            if (data.exito) {
                setZona(data.zona)
                setAtracciones(data.atracciones)
            }
        } catch {
            mostrarMensaje("error", "Error al cargar datos de la zona")
        } finally {
            setCargando(false)
        }
    }, [usuario.documento])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarDatos()
    }, [cargarDatos])

    async function handleVerCola(nombreAtraccion) {
        try {
            const cola = await getColaOperador(nombreAtraccion)
            setColaSeleccionada(cola)
            setAtraccionSeleccionada(nombreAtraccion)
        } catch {
            mostrarMensaje("error", "Error al cargar la cola")
        }
    }

    async function handleDejarPasar() {
        if (!atraccionSeleccionada) return
        try {
            const resultado = await dejarPasar(atraccionSeleccionada)
            if (resultado.exito) {
                mostrarMensaje("exito",
                    `✅ ${resultado.visitante} ingresó (${resultado.tipoTicket})`)
                handleVerCola(atraccionSeleccionada)
            } else {
                mostrarMensaje("error", resultado.mensaje)
            }
        } catch {
            mostrarMensaje("error", "Error al procesar el ingreso")
        }
    }

    async function handleValidarAcceso(e) {
        e.preventDefault()
        try {
            const resultado = await validarAcceso(
                formValidar.documento, formValidar.atraccion
            )
            setResultadoValidacion(resultado)
        } catch {
            mostrarMensaje("error", "Error al validar acceso")
        }
    }

    async function handleCambiarEstado(e) {
        e.preventDefault()
        if (!formEstado.motivo.trim()) {
            mostrarMensaje("error", "Debes ingresar el motivo del cambio de estado")
            return
        }
        try {
            const resultado = await cambiarEstadoAtraccion(
                formEstado.atraccion, formEstado.estado, formEstado.motivo
            )
            if (resultado.exito) {
                mostrarMensaje("exito", resultado.mensaje)
                setFormEstado({ atraccion: "", estado: "ACTIVA", motivo: "" })
                cargarDatos()
            } else {
                mostrarMensaje("error", resultado.mensaje)
            }
        } catch {
            mostrarMensaje("error", "Error al cambiar estado")
        }
    }

    function getBadgeEstado(estado) {
        const estilos = {
            ACTIVA: { bg: "#e8f5e9", color: "#28a745", texto: "✅ Activa" },
            EN_MANTENIMIENTO: { bg: "#fff8e1", color: "#f59e0b", texto: "🔧 Mantenimiento" },
            CERRADA: { bg: "#fdecea", color: "#dc3545", texto: "❌ Cerrada" }
        }
        return estilos[estado] || estilos.CERRADA
    }

    if (cargando) return <div className="cargando">Cargando panel del operador...</div>

    return (
        <div className="panel-operador">

            {/* Header */}
            <div className="operador-header">
                <div>
                    <h2>👷 Panel del Operador</h2>
                    <p>{usuario.nombre}</p>
                </div>
                <div className="zona-badge">
                    <span className="zona-label">Zona asignada</span>
                    <span className="zona-nombre">{zona}</span>
                </div>
            </div>

            {mensaje && (
                <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
            )}

            {/* Tabs */}
            <div className="tabs">
                {[
                    { id: "zona", label: "🎢 Mi Zona" },
                    { id: "cola", label: "👥 Gestionar Cola" },
                    { id: "validar", label: "✅ Validar Acceso" },
                    { id: "estado", label: "🔧 Cambiar Estado" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${seccion === tab.id ? "activo" : ""}`}
                        onClick={() => setSeccion(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* SECCIÓN: Mi Zona */}
            {seccion === "zona" && (
                <div className="seccion">
                    <h3>Atracciones en {zona}</h3>
                    <div className="atracciones-grid">
                        {atracciones.map((a, i) => {
                            const badge = getBadgeEstado(a.estado)
                            return (
                                <div key={i} className="atraccion-card">
                                    <h4>{a.nombre}</h4>
                                    <span className="badge-estado" style={{
                                        backgroundColor: badge.bg,
                                        color: badge.color
                                    }}>
                                        {badge.texto}
                                    </span>
                                    <div className="restricciones">
                                        <span>👤 Edad mín: {a.edadMinima} años</span>
                                        <span>📏 Altura mín: {a.alturaMinima}m</span>
                                        <span>🎯 Capacidad: {a.capacidad}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* SECCIÓN: Gestionar Cola */}
            {seccion === "cola" && (
                <div className="seccion">
                    <h3>Gestionar cola de atracción</h3>
                    <div className="selector-atraccion">
                        {atracciones.map((a, i) => (
                            <button
                                key={i}
                                className={`btn-atraccion ${atraccionSeleccionada === a.nombre ? "activo" : ""}`}
                                onClick={() => handleVerCola(a.nombre)}
                            >
                                {a.nombre}
                            </button>
                        ))}
                    </div>

                    {colaSeleccionada && (
                        <div className="cola-panel">
                            <div className="cola-info">
                                <h4>{colaSeleccionada.atraccion}</h4>
                                <div className="cola-stat">
                                    <span className="cola-numero">
                                        {colaSeleccionada.personasEnCola}
                                    </span>
                                    <span className="cola-label">personas en cola</span>
                                </div>
                                <p className="proximo-texto">
                                    Próximo: <strong>{colaSeleccionada.proximoEnEntrar}</strong>
                                </p>
                            </div>
                            <button
                                className="btn-dejar-pasar"
                                onClick={handleDejarPasar}
                                disabled={colaSeleccionada.personasEnCola === 0}
                            >
                                Dejar pasar ▶
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* SECCIÓN: Validar Acceso */}
            {seccion === "validar" && (
                <div className="seccion">
                    <h3>Validar acceso de visitante</h3>
                    <form className="form-validar" onSubmit={handleValidarAcceso}>
                        <div className="form-group">
                            <label>Documento del visitante</label>
                            <input
                                type="text"
                                placeholder="Ej: 123456"
                                value={formValidar.documento}
                                onChange={e => setFormValidar({
                                    ...formValidar, documento: e.target.value
                                })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Atracción</label>
                            <select
                                value={formValidar.atraccion}
                                onChange={e => setFormValidar({
                                    ...formValidar, atraccion: e.target.value
                                })}
                                required
                            >
                                <option value="">Selecciona una atracción</option>
                                {atracciones.map((a, i) => (
                                    <option key={i} value={a.nombre}>{a.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-validar">
                            Validar acceso
                        </button>
                    </form>

                    {resultadoValidacion && (
                        <div className={`resultado-validacion ${resultadoValidacion.exito ? "exito" : "error"}`}>
                            <p className="resultado-icono">
                                {resultadoValidacion.exito ? "✅" : "❌"}
                            </p>
                            <p className="resultado-mensaje">{resultadoValidacion.mensaje}</p>
                            {resultadoValidacion.exito && (
                                <p className="resultado-detalle">
                                    {resultadoValidacion.visitante} →  {resultadoValidacion.atraccion}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* SECCIÓN: Cambiar Estado */}
            {seccion === "estado" && (
                <div className="seccion">
                    <h3>Cambiar estado de atracción</h3>
                    <form className="form-estado" onSubmit={handleCambiarEstado}>
                        <div className="form-group">
                            <label>Atracción</label>
                            <select
                                value={formEstado.atraccion}
                                onChange={e => setFormEstado({
                                    ...formEstado, atraccion: e.target.value
                                })}
                                required
                            >
                                <option value="">Selecciona una atracción</option>
                                {atracciones.map((a, i) => (
                                    <option key={i} value={a.nombre}>{a.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Nuevo estado</label>
                            <select
                                value={formEstado.estado}
                                onChange={e => setFormEstado({
                                    ...formEstado, estado: e.target.value
                                })}
                            >
                                <option value="ACTIVA">✅ Activa</option>
                                <option value="EN_MANTENIMIENTO">🔧 En mantenimiento</option>
                                <option value="CERRADA">❌ Cerrada</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Motivo del cambio (obligatorio)</label>
                            <textarea
                                rows="3"
                                placeholder="Ej: Revisión técnica programada, cierre por lluvia..."
                                value={formEstado.motivo}
                                onChange={e => setFormEstado({
                                    ...formEstado, motivo: e.target.value
                                })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-cambiar-estado">
                            Aplicar cambio
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default PanelOperador