import { useState, useEffect, useCallback } from "react"
import { getAtracciones, cambiarEstadoAtraccion } from "../services/atraccionService"
import { getColaAtraccion, dejarPasar } from "../services/ticketService"
import { getInfoParque } from "../services/parqueService"
import "./Admin.css"

function Admin() {
    const [atracciones, setAtracciones] = useState([])
    const [infoParque, setInfoParque] = useState(null)
    const [colas, setColas] = useState({})
    const [mensaje, setMensaje] = useState(null)
    const [cargando, setCargando] = useState(true)

    function mostrarMensaje(tipo, texto) {
        setMensaje({ tipo, texto })
        setTimeout(() => setMensaje(null), 3000)
    }

    // useCallback evita que la función se redeclare en cada render
    const cargarDatos = useCallback(async () => {
        try {
            const [atr, info] = await Promise.all([
                getAtracciones(),
                getInfoParque()
            ])
            setAtracciones(atr)
            setInfoParque(info)

            const colasTemp = {}
            for (const a of atr) {
                const cola = await getColaAtraccion(a.nombre)
                colasTemp[a.nombre] = cola
            }
            setColas(colasTemp)
        } catch {
            setMensaje({ tipo: "error", texto: "Error al cargar datos del panel" })
        } finally {
            setCargando(false)
        }
    }, []) // sin dependencias porque solo usa setters y servicios externos

   useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarDatos()
    }, [cargarDatos])

    async function handleCambiarEstado(nombre, nuevoEstado) {
        try {
            const resultado = await cambiarEstadoAtraccion(nombre, nuevoEstado)
            if (resultado.exito) {
                mostrarMensaje("exito", `Estado de "${nombre}" actualizado a ${nuevoEstado}`)
                cargarDatos()
            } else {
                mostrarMensaje("error", resultado.mensaje)
            }
        } catch {
            mostrarMensaje("error", "Error al cambiar estado")
        }
    }

    async function handleDejarPasar(nombreAtraccion) {
        try {
            const resultado = await dejarPasar(nombreAtraccion)
            if (resultado.exito) {
                mostrarMensaje("exito",
                    `✅ ${resultado.visitante} (${resultado.tipoTicket}) ingresó a ${nombreAtraccion}`)
                cargarDatos()
            } else {
                mostrarMensaje("error", resultado.mensaje)
            }
        } catch {
            mostrarMensaje("error", "Error al procesar el ingreso")
        }
    }

    function getBadgeEstado(estado) {
        const estilos = {
            ACTIVA: { bg: "#e8f5e9", color: "#28a745", texto: "✅ Activa" },
            EN_MANTENIMIENTO: { bg: "#fff8e1", color: "#f59e0b", texto: "🔧 En mantenimiento" },
            CERRADA: { bg: "#fdecea", color: "#dc3545", texto: "❌ Cerrada" }
        }
        return estilos[estado] || estilos.CERRADA
    }

    if (cargando) return <div className="cargando">Cargando panel de administración...</div>

    return (
        <div className="admin">
            <h2>⚙️ Panel de Administración</h2>

            {mensaje && (
                <div className={`mensaje ${mensaje.tipo}`}>
                    {mensaje.texto}
                </div>
            )}

            {infoParque && (
                <div className="admin-stats">
                    <div className="stat-card">
                        <span className="stat-numero">{infoParque.visitantesActuales}</span>
                        <span className="stat-label">Visitantes en el parque</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-numero">{infoParque.capacidadMax}</span>
                        <span className="stat-label">Capacidad máxima</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-numero">{infoParque.totalZonas}</span>
                        <span className="stat-label">Zonas activas</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-numero">{atracciones.length}</span>
                        <span className="stat-label">Atracciones totales</span>
                    </div>
                </div>
            )}

            <h3 className="seccion-titulo">Gestión de atracciones</h3>
            <div className="tabla-container">
                <table className="tabla-admin">
                    <thead>
                        <tr>
                            <th>Atracción</th>
                            <th>Tipo</th>
                            <th>Estado actual</th>
                            <th>Cola</th>
                            <th>Cambiar estado</th>
                            <th>Acción cola</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atracciones.map((a, index) => {
                            const badge = getBadgeEstado(a.estado)
                            const cola = colas[a.nombre]
                            return (
                                <tr key={index}>
                                    <td><strong>{a.nombre}</strong></td>
                                    <td>{a.tipo}</td>
                                    <td>
                                        <span className="badge-estado" style={{
                                            backgroundColor: badge.bg,
                                            color: badge.color
                                        }}>
                                            {badge.texto}
                                        </span>
                                    </td>
                                    <td>
                                        {cola ? (
                                            <span className="cola-info">
                                                👥 {cola.personasEnCola} personas
                                                {cola.personasEnCola > 0 && (
                                                    <span className="proximo">
                                                        → {cola.proximoEnEntrar}
                                                    </span>
                                                )}
                                            </span>
                                        ) : "—"}
                                    </td>
                                    <td>
                                        <div className="botones-estado">
                                            <button
                                                className="btn-estado activa"
                                                onClick={() => handleCambiarEstado(a.nombre, "ACTIVA")}
                                                disabled={a.estado === "ACTIVA"}
                                            >
                                                Activar
                                            </button>
                                            <button
                                                className="btn-estado mantenimiento"
                                                onClick={() => handleCambiarEstado(a.nombre, "EN_MANTENIMIENTO")}
                                                disabled={a.estado === "EN_MANTENIMIENTO"}
                                            >
                                                Mantenimiento
                                            </button>
                                            <button
                                                className="btn-estado cerrada"
                                                onClick={() => handleCambiarEstado(a.nombre, "CERRADA")}
                                                disabled={a.estado === "CERRADA"}
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-pasar"
                                            onClick={() => handleDejarPasar(a.nombre)}
                                            disabled={!cola || cola.personasEnCola === 0}
                                        >
                                            Dejar pasar ▶
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Admin