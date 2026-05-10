import { useState, useEffect, useCallback, useRef } from "react"
import { getEstructuraGrafo, getRutaOptima, getBFS } from "../services/grafoService"
import "./MapaParque.css"

// Posiciones fijas para cada nodo en el canvas
const POSICIONES = {
    "Entrada Principal":     { x: 340, y: 440 },
    "Restaurante Central":   { x: 200, y: 320 },
    "Zona Aventura":         { x: 340, y: 240 },
    "Montaña Rusa Extrema":  { x: 180, y: 120 },
    "Free Fall Tower":       { x: 380, y: 100 },
    "Zona Acuática":         { x: 540, y: 240 },
    "Rapids River":          { x: 620, y: 120 },
    "Splash Zone":           { x: 520, y: 80  }
}

const COLORES = {
    nodoNormal:    "#1e3a5f",
    nodoRuta:      "#f59e0b",
    nodoOrigen:    "#28a745",
    nodoDestino:   "#dc3545",
    aristaNormal:  "#cbd5e1",
    aristaRuta:    "#f59e0b",
    texto:         "#ffffff",
    fondo:         "#f8faff"
}

function MapaParque() {
    const canvasRef = useRef(null)
    const [grafo, setGrafo] = useState({ nodos: [], aristas: [] })
    const [nodos, setNodos] = useState([])
    const [origen, setOrigen] = useState("")
    const [destino, setDestino] = useState("")
    const [resultado, setResultado] = useState(null)
    const [bfsResultado, setBfsResultado] = useState(null)
    const [rutaActiva, setRutaActiva] = useState([])
    const [cargando, setCargando] = useState(true)
    const [mensaje, setMensaje] = useState(null)
    const [tab, setTab] = useState("dijkstra")

    function mostrarMensaje(tipo, texto) {
        setMensaje({ tipo, texto })
        setTimeout(() => setMensaje(null), 3000)
    }

    const cargarGrafo = useCallback(async () => {
        try {
            const data = await getEstructuraGrafo()
            setGrafo(data)
            setNodos(data.nodos.map(n => n.id))
        } catch {
            mostrarMensaje("error", "Error al cargar el grafo")
        } finally {
            setCargando(false)
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarGrafo()
    }, [cargarGrafo])

    // Dibujar el grafo en el canvas
    useEffect(() => {
        if (!canvasRef.current || grafo.nodos.length === 0) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Fondo
        ctx.fillStyle = COLORES.fondo
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Dibujar aristas
        grafo.aristas.forEach(arista => {
            const posOrigen = POSICIONES[arista.origen]
            const posDestino = POSICIONES[arista.destino]
            if (!posOrigen || !posDestino) return

            const enRuta = rutaActiva.includes(arista.origen) &&
                           rutaActiva.includes(arista.destino)

            ctx.beginPath()
            ctx.moveTo(posOrigen.x, posOrigen.y)
            ctx.lineTo(posDestino.x, posDestino.y)
            ctx.strokeStyle = enRuta ? COLORES.aristaRuta : COLORES.aristaNormal
            ctx.lineWidth = enRuta ? 4 : 2
            ctx.stroke()

            // Etiqueta de distancia
            const midX = (posOrigen.x + posDestino.x) / 2
            const midY = (posOrigen.y + posDestino.y) / 2
            ctx.fillStyle = enRuta ? COLORES.aristaRuta : "#94a3b8"
            ctx.font = "11px Arial"
            ctx.textAlign = "center"
            ctx.fillText(`${arista.distancia}m`, midX, midY - 6)
        })

        // Dibujar nodos
        grafo.nodos.forEach(nodo => {
            const pos = POSICIONES[nodo.id]
            if (!pos) return

            let color = COLORES.nodoNormal
            if (nodo.id === origen) color = COLORES.nodoOrigen
            else if (nodo.id === destino) color = COLORES.nodoDestino
            else if (rutaActiva.includes(nodo.id)) color = COLORES.nodoRuta

            // Sombra
            ctx.shadowColor = "rgba(0,0,0,0.2)"
            ctx.shadowBlur = 8
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()
            ctx.shadowBlur = 0

            // Borde blanco
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2)
            ctx.strokeStyle = "white"
            ctx.lineWidth = 3
            ctx.stroke()

            // Texto del nodo
            ctx.fillStyle = COLORES.texto
            ctx.font = "bold 10px Arial"
            ctx.textAlign = "center"
            const palabras = nodo.id.split(" ")
            palabras.forEach((palabra, i) => {
                const offset = (i - (palabras.length - 1) / 2) * 13
                ctx.fillText(palabra, pos.x, pos.y + offset + 3)
            })
        })

    }, [grafo, rutaActiva, origen, destino])

    async function handleDijkstra(e) {
        e.preventDefault()
        if (!origen || !destino) {
            mostrarMensaje("error", "Selecciona origen y destino")
            return
        }
        if (origen === destino) {
            mostrarMensaje("error", "El origen y destino deben ser diferentes")
            return
        }
        try {
            const data = await getRutaOptima(origen, destino)
            setResultado(data)
            setRutaActiva(data.encontrado ? data.ruta : [])
            setBfsResultado(null)
        } catch {
            mostrarMensaje("error", "Error al calcular la ruta")
        }
    }

    async function handleBFS(e) {
        e.preventDefault()
        if (!origen) {
            mostrarMensaje("error", "Selecciona el nodo de inicio")
            return
        }
        try {
            const data = await getBFS(origen)
            setBfsResultado(data)
            setRutaActiva(data.recorrido)
            setResultado(null)
        } catch {
            mostrarMensaje("error", "Error al calcular BFS")
        }
    }

    function limpiar() {
        setResultado(null)
        setBfsResultado(null)
        setRutaActiva([])
        setOrigen("")
        setDestino("")
    }

    if (cargando) return <div className="cargando">Cargando mapa del parque...</div>

    return (
        <div className="mapa-parque">
            <h2>🗺️ Mapa del Parque</h2>

            {mensaje && (
                <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
            )}

            <div className="mapa-layout">

                {/* Canvas del grafo */}
                <div className="canvas-container">
                    <canvas
                        ref={canvasRef}
                        width={760}
                        height={520}
                        className="grafo-canvas"
                    />
                    <div className="leyenda">
                        <span className="ley-item">
                            <span className="ley-color" style={{background: COLORES.nodoOrigen}}/>
                            Origen
                        </span>
                        <span className="ley-item">
                            <span className="ley-color" style={{background: COLORES.nodoDestino}}/>
                            Destino
                        </span>
                        <span className="ley-item">
                            <span className="ley-color" style={{background: COLORES.nodoRuta}}/>
                            En ruta
                        </span>
                        <span className="ley-item">
                            <span className="ley-color" style={{background: COLORES.nodoNormal}}/>
                            Nodo
                        </span>
                    </div>
                </div>

                {/* Panel de control */}
                <div className="panel-control">

                    {/* Tabs */}
                    <div className="tabs-small">
                        <button
                            className={`tab-small ${tab === "dijkstra" ? "activo" : ""}`}
                            onClick={() => { setTab("dijkstra"); limpiar() }}
                        >
                            Dijkstra
                        </button>
                        <button
                            className={`tab-small ${tab === "bfs" ? "activo" : ""}`}
                            onClick={() => { setTab("bfs"); limpiar() }}
                        >
                            BFS
                        </button>
                    </div>

                    {/* DIJKSTRA */}
                    {tab === "dijkstra" && (
                        <form onSubmit={handleDijkstra} className="form-grafo">
                            <h3>Ruta óptima (Dijkstra)</h3>
                            <p className="form-desc">
                                Calcula el camino más corto entre dos puntos del parque.
                            </p>
                            <div className="form-group">
                                <label>Origen</label>
                                <select value={origen}
                                    onChange={e => setOrigen(e.target.value)} required>
                                    <option value="">Selecciona origen</option>
                                    {nodos.map((n, i) => (
                                        <option key={i} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Destino</label>
                                <select value={destino}
                                    onChange={e => setDestino(e.target.value)} required>
                                    <option value="">Selecciona destino</option>
                                    {nodos.map((n, i) => (
                                        <option key={i} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-botones">
                                <button type="submit" className="btn-calcular">
                                    Calcular ruta
                                </button>
                                <button type="button"
                                    className="btn-limpiar" onClick={limpiar}>
                                    Limpiar
                                </button>
                            </div>

                            {resultado && (
                                <div className={`resultado ${resultado.encontrado ? "exito" : "error"}`}>
                                    {resultado.encontrado ? (
                                        <>
                                            <p className="res-titulo">✅ Ruta encontrada</p>
                                            <div className="ruta-pasos">
                                                {resultado.ruta.map((paso, i) => (
                                                    <span key={i} className="ruta-paso">
                                                        {paso}
                                                        {i < resultado.ruta.length - 1 && (
                                                            <span className="flecha"> →</span>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="res-distancia">
                                                📏 Distancia total:{" "}
                                                <strong>{resultado.distanciaTotal}m</strong>
                                            </p>
                                        </>
                                    ) : (
                                        <p>❌ {resultado.mensaje}</p>
                                    )}
                                </div>
                            )}
                        </form>
                    )}

                    {/* BFS */}
                    {tab === "bfs" && (
                        <form onSubmit={handleBFS} className="form-grafo">
                            <h3>Recorrido BFS</h3>
                            <p className="form-desc">
                                Explora todos los nodos del parque por niveles
                                desde un punto de inicio.
                            </p>
                            <div className="form-group">
                                <label>Nodo de inicio</label>
                                <select value={origen}
                                    onChange={e => setOrigen(e.target.value)} required>
                                    <option value="">Selecciona inicio</option>
                                    {nodos.map((n, i) => (
                                        <option key={i} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-botones">
                                <button type="submit" className="btn-calcular">
                                    Ejecutar BFS
                                </button>
                                <button type="button"
                                    className="btn-limpiar" onClick={limpiar}>
                                    Limpiar
                                </button>
                            </div>

                            {bfsResultado && (
                                <div className="resultado exito">
                                    <p className="res-titulo">
                                        Recorrido desde {bfsResultado.inicio}
                                    </p>
                                    <div className="bfs-pasos">
                                        {bfsResultado.recorrido.map((nodo, i) => (
                                            <div key={i} className="bfs-paso">
                                                <span className="bfs-num">{i + 1}</span>
                                                <span>{nodo}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="res-distancia">
                                        Total: <strong>
                                            {bfsResultado.totalNodos} nodos
                                        </strong> recorridos
                                    </p>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MapaParque