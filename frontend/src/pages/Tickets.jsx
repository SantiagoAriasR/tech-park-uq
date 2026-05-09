import { useState, useEffect, useCallback } from "react"
import { getAtracciones } from "../services/atraccionService"
import { getVisitantes } from "../services/visitanteService"
import { comprarTicket, getColaAtraccion } from "../services/ticketService"
import "./Tickets.css"

function Tickets() {
    const [atracciones, setAtracciones] = useState([])
    const [visitantes, setVisitantes] = useState([])
    const [colaSeleccionada, setColaSeleccionada] = useState(null)
    const [mensaje, setMensaje] = useState(null)
    const [cargando, setCargando] = useState(true)

    const [form, setForm] = useState({
        documento: "",
        tipo: "GENERAL",
        atraccion: ""
    })

    const cargarDatos = useCallback(async () => {
        try {
            const [atr, vis] = await Promise.all([
                getAtracciones(),
                getVisitantes()
            ])
            // Solo mostrar atracciones activas
            setAtracciones(atr.filter(a => a.estado === "ACTIVA"))
            setVisitantes(vis)
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

    function mostrarMensaje(tipo, texto) {
        setMensaje({ tipo, texto })
        setTimeout(() => setMensaje(null), 4000)
    }

    function manejarCambio(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function manejarCompra(e) {
        e.preventDefault()
        if (!form.documento || !form.atraccion) {
            mostrarMensaje("error", "Completa todos los campos")
            return
        }
        try {
            const resultado = await comprarTicket(
                form.documento, form.tipo, form.atraccion
            )
            if (resultado.exito) {
                mostrarMensaje("exito", `✅ Ticket ${form.tipo} comprado correctamente`)
                // Actualizar la cola de la atracción seleccionada
                const cola = await getColaAtraccion(form.atraccion)
                setColaSeleccionada({ nombre: form.atraccion, ...cola })
                // Limpiar el formulario después de compra exitosa
                setForm({ documento: "", tipo: "GENERAL", atraccion: "" })
                cargarDatos() // recargar datos para actualizar saldos y colas
            } else {
                mostrarMensaje("error", resultado.mensaje)
            }
        } catch {
            mostrarMensaje("error", "Error al procesar la compra")
        }
    }

    async function verCola(nombreAtraccion) {
        try {
            const cola = await getColaAtraccion(nombreAtraccion)
            setColaSeleccionada({ nombre: nombreAtraccion, ...cola })
        } catch {
            mostrarMensaje("error", "Error al cargar la cola")
        }
    }

    function getPrecioTicket(tipo) {
        const precios = {
            GENERAL: 25000,
            FAMILIAR: 42500,
            FASTPASS: 80000
        }
        return precios[tipo]?.toLocaleString() || "—"
    }

    function getDescripcionTicket(tipo) {
        const descripciones = {
            GENERAL: "Acceso estándar, entra en orden de llegada",
            FAMILIAR: "Descuento del 15% para grupos familiares",
            FASTPASS: "Prioridad máxima, salta la fila hasta 3 veces"
        }
        return descripciones[tipo] || ""
    }

    if (cargando) return <div className="cargando">Cargando...</div>

    return (
        <div className="tickets">
            <h2>🎟️ Compra de Tickets</h2>

            {mensaje && (
                <div className={`mensaje ${mensaje.tipo}`}>
                    {mensaje.texto}
                </div>
            )}

            <div className="tickets-layout">

                {/* Panel izquierdo — formulario de compra */}
                <div className="panel-compra">
                    <h3>Comprar ticket</h3>
                    <form onSubmit={manejarCompra}>

                        {/* Selección de visitante */}
                        <div className="form-group">
                            <label>Visitante</label>
                            <select name="documento" value={form.documento}
                                onChange={manejarCambio} required>
                                <option value="">Selecciona un visitante</option>
                                {visitantes.map((v, i) => (
                                    <option key={i} value={v.documento}>
                                        {v.nombre} — Saldo: ${v.saldo?.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selección de atracción */}
                        <div className="form-group">
                            <label>Atracción</label>
                            <select name="atraccion" value={form.atraccion}
                                onChange={manejarCambio} required>
                                <option value="">Selecciona una atracción</option>
                                {atracciones.map((a, i) => (
                                    <option key={i} value={a.nombre}>
                                        {a.nombre} ({a.tipo})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selección de tipo de ticket */}
                        <div className="form-group">
                            <label>Tipo de ticket</label>
                            <div className="ticket-opciones">
                                {["GENERAL", "FAMILIAR", "FASTPASS"].map(tipo => (
                                    <div
                                        key={tipo}
                                        className={`ticket-opcion ${form.tipo === tipo ? "seleccionado" : ""}`}
                                        onClick={() => setForm({ ...form, tipo })}
                                    >
                                        <span className="ticket-tipo">{tipo}</span>
                                        <span className="ticket-precio">
                                            ${getPrecioTicket(tipo)}
                                        </span>
                                        <span className="ticket-desc">
                                            {getDescripcionTicket(tipo)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-comprar">
                            Comprar ticket
                        </button>
                    </form>
                </div>

                {/* Panel derecho — estado de colas */}
                <div className="panel-colas">
                    <h3>Estado de colas</h3>
                    <div className="lista-colas">
                        {atracciones.map((a, i) => (
                            <div key={i} className="cola-item">
                                <div className="cola-info-nombre">
                                    <strong>{a.nombre}</strong>
                                    <span className="cola-tipo">{a.tipo}</span>
                                </div>
                                <button
                                    className="btn-ver-cola"
                                    onClick={() => verCola(a.nombre)}
                                >
                                    Ver cola
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Detalle de cola seleccionada */}
                    {colaSeleccionada && (
                        <div className="cola-detalle">
                            <h4>🎢 {colaSeleccionada.nombre}</h4>
                            <div className="cola-stat">
                                <span className="cola-numero">
                                    {colaSeleccionada.personasEnCola}
                                </span>
                                <span className="cola-label">personas en cola</span>
                            </div>
                            {colaSeleccionada.personasEnCola > 0 && (
                                <p className="cola-proximo">
                                    Próximo en entrar: <strong>
                                        {colaSeleccionada.proximoEnEntrar}
                                    </strong>
                                </p>
                            )}
                            {colaSeleccionada.personasEnCola === 0 && (
                                <p className="cola-vacia">Cola vacía — ¡entra directo!</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Tickets