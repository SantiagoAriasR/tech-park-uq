import { useState, useEffect, useCallback } from "react"
import { getNotificaciones, marcarLeida } from "../services/notificacionService"
import "./Notificaciones.css"

function Notificaciones({ documento }) {
    const [notificaciones, setNotificaciones] = useState([])
    const [abierto, setAbierto] = useState(false)
    const [noLeidas, setNoLeidas] = useState(0)

    const cargarNotificaciones = useCallback(async () => {
        try {
            const data = await getNotificaciones(documento)
            setNotificaciones(data)
            setNoLeidas(data.filter(n => !n.leida).length)
        } catch {
            console.error("Error al cargar notificaciones")
        }
    }, [documento])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarNotificaciones()
        // Polling cada 30 segundos para nuevas notificaciones
        const intervalo = setInterval(cargarNotificaciones, 30000)
        return () => clearInterval(intervalo)
    }, [cargarNotificaciones])

    async function handleMarcarLeida(id) {
        try {
            await marcarLeida(id)
            cargarNotificaciones()
        } catch {
            console.error("Error al marcar como leída")
        }
    }

    async function handleMarcarTodasLeidas() {
        try {
            const noLeidas = notificaciones.filter(n => !n.leida)
            await Promise.all(noLeidas.map(n => marcarLeida(n.id)))
            cargarNotificaciones()
        } catch {
            console.error("Error al marcar todas como leídas")
        }
    }

    function getIconoTipo(tipo) {
        const iconos = {
            ALERTA_CLIMATICA: "⛈️",
            CAMBIO_ESTADO_ATRACCION: "🎢",
            TICKET_PROXIMO: "🎟️"
        }
        return iconos[tipo] || "🔔"
    }

    function formatearFecha(fechaStr) {
        const fecha = new Date(fechaStr)
        return fecha.toLocaleString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    return (
        <div className="notificaciones-container">
            {/* Botón campana */}
            <button
                className="btn-campana"
                onClick={() => setAbierto(!abierto)}
            >
                🔔
                {noLeidas > 0 && (
                    <span className="badge-noLeidas">{noLeidas}</span>
                )}
            </button>

            {/* Panel de notificaciones */}
            {abierto && (
                <div className="notif-panel">
                    <div className="notif-header">
                        <h4>Notificaciones</h4>
                        {noLeidas > 0 && (
                            <button
                                className="btn-marcar-todas"
                                onClick={handleMarcarTodasLeidas}
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    <div className="notif-lista">
                        {notificaciones.length === 0 ? (
                            <div className="notif-vacio">
                                <p>No tienes notificaciones</p>
                            </div>
                        ) : (
                            notificaciones.map((n, i) => (
                                <div
                                    key={i}
                                    className={`notif-item ${n.leida ? "leida" : "no-leida"}`}
                                >
                                    <div className="notif-icono">
                                        {getIconoTipo(n.tipo)}
                                    </div>
                                    <div className="notif-contenido">
                                        <p className="notif-mensaje">{n.mensaje}</p>
                                        <p className="notif-fecha">
                                            {formatearFecha(n.fecha)}
                                        </p>
                                    </div>
                                    {!n.leida && (
                                        <button
                                            className="btn-leer"
                                            onClick={() => handleMarcarLeida(n.id)}
                                        >
                                            ✓
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notificaciones