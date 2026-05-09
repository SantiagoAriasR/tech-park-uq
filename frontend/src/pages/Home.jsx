import { useState, useEffect } from "react"
import { getInfoParque } from "../services/parqueService"
import { getAtracciones } from "../services/atraccionService"
import "./Home.css"

function Home() {
    const [infoParque, setInfoParque] = useState(null)
    const [atracciones, setAtracciones] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        async function cargarDatos() {
            try {
                const info = await getInfoParque()
                const atr = await getAtracciones()
                setInfoParque(info)
                setAtracciones(atr)
            } catch (error) {
                console.error("Error al cargar datos:", error)
            } finally {
                setCargando(false)
            }
        }
        cargarDatos()
    }, [])

    if (cargando) return <div className="cargando">Cargando...</div>

    return (
        <div className="home">
            {/* Info del parque */}
            {infoParque && (
                <div className="parque-info">
                    <h2>🎢 {infoParque.nombre}</h2>
                    <div className="stats">
                        <div className="stat">
                            <span className="stat-numero">{infoParque.visitantesActuales}</span>
                            <span className="stat-label">Visitantes</span>
                        </div>
                        <div className="stat">
                            <span className="stat-numero">{infoParque.capacidadMax}</span>
                            <span className="stat-label">Capacidad</span>
                        </div>
                        <div className="stat">
                            <span className="stat-numero">{infoParque.totalZonas}</span>
                            <span className="stat-label">Zonas</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de atracciones */}
            <h3 className="seccion-titulo">Atracciones disponibles</h3>
            <div className="atracciones-grid">
                {atracciones.map((a, index) => (
                    <div key={index} className={`atraccion-card ${a.estado === "ACTIVA" ? "activa" : "inactiva"}`}>
                        <h4>{a.nombre}</h4>
                        <p className="tipo">{a.tipo}</p>
                        <p className="estado">{a.estado}</p>
                        <div className="detalles">
                            <span>👤 Min: {a.edadMinima} años</span>
                            <span>📏 Min: {a.alturaMinima}m</span>
                            <span>💰 +${a.costoExtra?.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home