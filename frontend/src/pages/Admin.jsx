import { useState, useEffect, useCallback } from "react";
import {
  getAtracciones,
  cambiarEstadoAtraccion,
} from "../services/atraccionService";
import { getColaAtraccion, dejarPasar } from "../services/ticketService";
import { getInfoParque } from "../services/parqueService";
import {
  getAlertaClimatica,
  activarAlerta,
  desactivarAlerta,
  getReporte,
} from "../services/adminService";
import "./Admin.css";
import { Link } from "react-router-dom";

function Admin() {
  const [atracciones, setAtracciones] = useState([]);
  const [infoParque, setInfoParque] = useState(null);
  const [colas, setColas] = useState({});
  const [alerta, setAlerta] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [seccion, setSeccion] = useState("atracciones");

  // Form alerta
  const [formAlerta, setFormAlerta] = useState({
    tipo: "LLUVIA_FUERTE",
    descripcion: "",
  });

  function mostrarMensaje(tipo, texto) {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  }

  const cargarDatos = useCallback(async () => {
    try {
      const [atr, info, alertaActual] = await Promise.all([
        getAtracciones(),
        getInfoParque(),
        getAlertaClimatica(),
      ]);
      setAtracciones(atr);
      setInfoParque(info);
      setAlerta(alertaActual.activa ? alertaActual : null);

      const colasTemp = {};
      for (const a of atr) {
        const cola = await getColaAtraccion(a.nombre);
        colasTemp[a.nombre] = cola;
      }
      setColas(colasTemp);
    } catch {
      mostrarMensaje("error", "Error al cargar datos del panel");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDatos();
  }, [cargarDatos]);

  async function handleCambiarEstado(nombre, nuevoEstado) {
    try {
      const resultado = await cambiarEstadoAtraccion(nombre, nuevoEstado);
      if (resultado.exito) {
        mostrarMensaje("exito", `Estado de "${nombre}" actualizado`);
        cargarDatos();
      } else {
        mostrarMensaje("error", resultado.mensaje);
      }
    } catch {
      mostrarMensaje("error", "Error al cambiar estado");
    }
  }

  async function handleDejarPasar(nombreAtraccion) {
    try {
      const resultado = await dejarPasar(nombreAtraccion);
      if (resultado.exito) {
        mostrarMensaje(
          "exito",
          `✅ ${resultado.visitante} (${resultado.tipoTicket}) ingresó`,
        );
        cargarDatos();
      } else {
        mostrarMensaje("error", resultado.mensaje);
      }
    } catch {
      mostrarMensaje("error", "Error al procesar ingreso");
    }
  }

  async function handleActivarAlerta(e) {
    e.preventDefault();
    if (!formAlerta.descripcion.trim()) {
      mostrarMensaje("error", "Describe la situación climática");
      return;
    }
    try {
      const resultado = await activarAlerta(
        formAlerta.tipo,
        formAlerta.descripcion,
      );
      if (resultado.exito) {
        mostrarMensaje(
          "exito",
          `⚠️ Alerta activada. ${resultado.atraccionesCerradas} atracciones cerradas`,
        );
        setFormAlerta({ tipo: "LLUVIA_FUERTE", descripcion: "" });
        cargarDatos();
      }
    } catch {
      mostrarMensaje("error", "Error al activar alerta");
    }
  }

  async function handleDesactivarAlerta() {
    try {
      const resultado = await desactivarAlerta();
      if (resultado.exito) {
        mostrarMensaje(
          "exito",
          `✅ Alerta desactivada. ${resultado.atraccionesReactivadas} atracciones reactivadas`,
        );
        cargarDatos();
      }
    } catch {
      mostrarMensaje("error", "Error al desactivar alerta");
    }
  }

  async function handleGenerarReporte() {
    try {
      const data = await getReporte();
      setReporte(data);
      setSeccion("reporte");
    } catch {
      mostrarMensaje("error", "Error al generar reporte");
    }
  }

  function getBadgeEstado(estado) {
    const estilos = {
      ACTIVA: { bg: "#e8f5e9", color: "#28a745", texto: "✅ Activa" },
      EN_MANTENIMIENTO: {
        bg: "#fff8e1",
        color: "#f59e0b",
        texto: "🔧 Mantenimiento",
      },
      CERRADA: { bg: "#fdecea", color: "#dc3545", texto: "❌ Cerrada" },
    };
    return estilos[estado] || estilos.CERRADA;
  }

  if (cargando) return <div className="cargando">Cargando panel...</div>;

  return (
    <div className="admin">
      <h2>⚙️ Panel de Administración</h2>

      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      {/* Alerta climática activa */}
      {alerta && (
        <div className="alerta-activa">
          <span>
            ⚠️ ALERTA ACTIVA: {alerta.tipo} — {alerta.descripcion}
          </span>
          <button onClick={handleDesactivarAlerta} className="btn-desactivar">
            Desactivar
          </button>
        </div>
      )}

      {/* Stats */}
      {infoParque && (
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-numero">{infoParque.visitantesActuales}</span>
            <span className="stat-label">Visitantes</span>
          </div>
          <div className="stat-card">
            <span className="stat-numero">{infoParque.capacidadMax}</span>
            <span className="stat-label">Capacidad máx</span>
          </div>
          <div className="stat-card">
            <span className="stat-numero">{infoParque.totalZonas}</span>
            <span className="stat-label">Zonas</span>
          </div>
          <div className="stat-card">
            <span className="stat-numero">{atracciones.length}</span>
            <span className="stat-label">Atracciones</span>
          </div>
          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={handleGenerarReporte}
          >
            <span className="stat-numero">📊</span>
            <span className="stat-label">Ver Reporte</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: "atracciones", label: "🎢 Atracciones" },
          { id: "clima", label: "⛈️ Alerta Climática" },
          { id: "reporte", label: "📊 Reporte" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab ${seccion === tab.id ? "activo" : ""}`}
            onClick={() => {
              setSeccion(tab.id);
              if (tab.id === "reporte") handleGenerarReporte();
            }}
          >
            {tab.label}
          </button>
        ))}
        <Link to="/zonas" className="btn-zonas">
          🏗️ Gestionar Zonas
        </Link>
      </div>

      {/* SECCIÓN: Atracciones */}
      {seccion === "atracciones" && (
        <div className="tabla-container">
          <table className="tabla-admin">
            <thead>
              <tr>
                <th>Atracción</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Cola</th>
                <th>Cambiar estado</th>
                <th>Cola acción</th>
              </tr>
            </thead>
            <tbody>
              {atracciones.map((a, index) => {
                const badge = getBadgeEstado(a.estado);
                const cola = colas[a.nombre];
                return (
                  <tr key={index}>
                    <td>
                      <strong>{a.nombre}</strong>
                    </td>
                    <td>{a.tipo}</td>
                    <td>
                      <span
                        className="badge-estado"
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {badge.texto}
                      </span>
                    </td>
                    <td>
                      {cola ? (
                        <span className="cola-info">
                          👥 {cola.personasEnCola}
                          {cola.personasEnCola > 0 && (
                            <span className="proximo">
                              → {cola.proximoEnEntrar}
                            </span>
                          )}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div className="botones-estado">
                        <button
                          className="btn-estado activa"
                          onClick={() =>
                            handleCambiarEstado(a.nombre, "ACTIVA")
                          }
                          disabled={a.estado === "ACTIVA"}
                        >
                          Activar
                        </button>
                        <button
                          className="btn-estado mantenimiento"
                          onClick={() =>
                            handleCambiarEstado(a.nombre, "EN_MANTENIMIENTO")
                          }
                          disabled={a.estado === "EN_MANTENIMIENTO"}
                        >
                          Mantenimiento
                        </button>
                        <button
                          className="btn-estado cerrada"
                          onClick={() =>
                            handleCambiarEstado(a.nombre, "CERRADA")
                          }
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* SECCIÓN: Alerta Climática */}
      {seccion === "clima" && (
        <div className="seccion-clima">
          <div className="clima-estado">
            <h3>Estado climático actual</h3>
            {alerta ? (
              <div className="alerta-card activa">
                <p className="alerta-icono">⛈️</p>
                <p className="alerta-tipo">{alerta.tipo}</p>
                <p className="alerta-desc">{alerta.descripcion}</p>
                <button
                  className="btn-desactivar-grande"
                  onClick={handleDesactivarAlerta}
                >
                  ✅ Desactivar alerta
                </button>
              </div>
            ) : (
              <div className="alerta-card normal">
                <p className="alerta-icono">☀️</p>
                <p className="alerta-tipo">Sin alertas</p>
                <p className="alerta-desc">Condiciones climáticas normales</p>
              </div>
            )}
          </div>

          {!alerta && (
            <div className="clima-form">
              <h3>Activar alerta climática</h3>
              <form onSubmit={handleActivarAlerta}>
                <div className="form-group">
                  <label>Tipo de alerta</label>
                  <div className="alerta-opciones">
                    {[
                      {
                        valor: "LLUVIA_FUERTE",
                        icono: "🌧️",
                        desc: "Cierra atracciones acuáticas y mecánicas",
                      },
                      {
                        valor: "TORMENTA_ELECTRICA",
                        icono: "⚡",
                        desc: "Cierra TODAS las atracciones",
                      },
                      {
                        valor: "VIENTO_FUERTE",
                        icono: "💨",
                        desc: "Alerta informativa",
                      },
                    ].map((op) => (
                      <div
                        key={op.valor}
                        className={`alerta-opcion ${formAlerta.tipo === op.valor ? "seleccionada" : ""}`}
                        onClick={() =>
                          setFormAlerta({
                            ...formAlerta,
                            tipo: op.valor,
                          })
                        }
                      >
                        <span className="op-icono">{op.icono}</span>
                        <span className="op-valor">{op.valor}</span>
                        <span className="op-desc">{op.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción de la situación</label>
                  <textarea
                    rows="3"
                    placeholder="Ej: Lluvia intensa prevista para las próximas 2 horas..."
                    value={formAlerta.descripcion}
                    onChange={(e) =>
                      setFormAlerta({
                        ...formAlerta,
                        descripcion: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn-activar-alerta">
                  ⚠️ Activar alerta
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* SECCIÓN: Reporte */}
      {seccion === "reporte" && reporte && (
        <div className="seccion-reporte">
          <h3>📊 Reporte de Jornada — {reporte.fecha}</h3>

          <div className="reporte-stats">
            <div className="reporte-stat">
              <span className="r-numero">{reporte.totalVisitantes}</span>
              <span className="r-label">Visitantes</span>
            </div>
            <div className="reporte-stat">
              <span className="r-numero">
                ${reporte.ingresosTotales?.toLocaleString()}
              </span>
              <span className="r-label">Ingresos totales</span>
            </div>
            <div className="reporte-stat">
              <span className="r-numero">{reporte.totalTicketsVendidos}</span>
              <span className="r-label">Tickets vendidos</span>
            </div>
            <div className="reporte-stat">
              <span className="r-numero">{reporte.cierresPorClima}</span>
              <span className="r-label">Cierres por clima</span>
            </div>
            <div className="reporte-stat">
              <span className="r-numero">{reporte.alertasMantenimiento}</span>
              <span className="r-label">Alertas mantenimiento</span>
            </div>
          </div>

          <h4 className="top-titulo">🏆 Top atracciones más visitadas</h4>
          {reporte.atraccionesTop?.length > 0 ? (
            <div className="top-lista">
              {reporte.atraccionesTop.map((a, i) => (
                <div key={i} className="top-item">
                  <span className="top-pos">#{i + 1}</span>
                  <span className="top-nombre">{a.nombre}</span>
                  <span className="top-visitas">{a.visitas} visitas</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="sin-datos">
              No hay visitas registradas aún en esta jornada.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;
