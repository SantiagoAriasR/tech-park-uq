import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getVisitante } from "../services/visitanteService";
import {
  getHistorial,
  getFavoritos,
  agregarFavorito,
  eliminarFavorito,
} from "../services/visitanteService";
import { getAtracciones } from "../services/atraccionService";
import { comprarTicket, getColaAtraccion } from "../services/ticketService";
import { recargarSaldo, actualizarPerfil } from "../services/visitanteService";
import "./PanelVisitante.css";

function PanelVisitante() {
  const { usuario } = useAuth();
  const [visitante, setVisitante] = useState(null);
  const [atracciones, setAtracciones] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [colaSeleccionada, setColaSeleccionada] = useState(null);
  const [seccion, setSeccion] = useState("atracciones");
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [formPerfil, setFormPerfil] = useState({
    nombre: "",
    email: "",
    contrasena: "",
  });
  const [formRecarga, setFormRecarga] = useState({ monto: "" });

  const [formTicket, setFormTicket] = useState({
    tipo: "GENERAL",
    atraccion: "",
  });

  function mostrarMensaje(tipo, texto) {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  }

  const cargarDatos = useCallback(async () => {
    try {
      const [atr, hist, favs] = await Promise.all([
        getAtracciones(),
        getHistorial(usuario.documento),
        getFavoritos(usuario.documento),
      ]);
      // Buscar visitante por documento directamente
      const visResp = await getVisitante(usuario.documento);
      if (visResp.visitante) setVisitante(visResp.visitante);
      if (visResp.visitante) {
        setVisitante(visResp.visitante);
        setFormPerfil({
          nombre: visResp.visitante.nombre || "",
          email: visResp.visitante.email || "",
          contrasena: "",
        });
      }
      setAtracciones(atr.filter((a) => a.estado === "ACTIVA"));
      if (hist.historial) setHistorial(hist.historial);
      if (favs.favoritos) setFavoritos(favs.favoritos);
    } catch {
      mostrarMensaje("error", "Error al cargar datos");
    } finally {
      setCargando(false);
    }
  }, [usuario.documento]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDatos();
  }, [cargarDatos]);

  async function handleComprarTicket(e) {
    e.preventDefault();
    if (!formTicket.atraccion) {
      mostrarMensaje("error", "Selecciona una atracción");
      return;
    }
    try {
      const resultado = await comprarTicket(
        usuario.documento,
        formTicket.tipo,
        formTicket.atraccion,
      );
      if (resultado.exito) {
        mostrarMensaje("exito", `✅ Ticket ${formTicket.tipo} comprado`);
        const cola = await getColaAtraccion(formTicket.atraccion);
        setColaSeleccionada({ nombre: formTicket.atraccion, ...cola });
        setFormTicket({ tipo: "GENERAL", atraccion: "" });
        cargarDatos();
      } else {
        mostrarMensaje("error", resultado.mensaje);
      }
    } catch {
      mostrarMensaje("error", "Error al comprar ticket");
    }
  }

  async function handleToggleFavorito(nombreAtraccion) {
    const esFavorito = favoritos.includes(nombreAtraccion);
    try {
      if (esFavorito) {
        await eliminarFavorito(usuario.documento, nombreAtraccion);
        mostrarMensaje("exito", `❌ Eliminado de favoritos`);
      } else {
        await agregarFavorito(usuario.documento, nombreAtraccion);
        mostrarMensaje("exito", `⭐ Agregado a favoritos`);
      }
      cargarDatos();
    } catch {
      mostrarMensaje("error", "Error al actualizar favoritos");
    }
  }
  async function handleRecargarSaldo(e) {
    e.preventDefault();
    const monto = parseFloat(formRecarga.monto);
    if (isNaN(monto) || monto <= 0) {
      mostrarMensaje("error", "Ingresa un monto válido mayor a 0");
      return;
    }
    try {
      const resultado = await recargarSaldo(usuario.documento, monto);
      if (resultado.exito) {
        mostrarMensaje(
          "exito",
          `✅ Saldo recargado. Nuevo saldo: $${resultado.nuevoSaldo?.toLocaleString()}`,
        );
        setFormRecarga({ monto: "" });
        cargarDatos();
      } else {
        mostrarMensaje("error", resultado.mensaje);
      }
    } catch {
      mostrarMensaje("error", "Error al recargar saldo");
    }
  }

  async function handleActualizarPerfil(e) {
    e.preventDefault();
    try {
      const datos = { nombre: formPerfil.nombre, email: formPerfil.email };
      if (formPerfil.contrasena.trim()) {
        datos.contrasena = formPerfil.contrasena;
      }
      const resultado = await actualizarPerfil(usuario.documento, datos);
      if (resultado.exito) {
        mostrarMensaje("exito", "✅ Perfil actualizado correctamente");
        setFormPerfil({ ...formPerfil, contrasena: "" });
        cargarDatos();
      } else {
        mostrarMensaje("error", resultado.mensaje);
      }
    } catch {
      mostrarMensaje("error", "Error al actualizar perfil");
    }
  }

  async function handleVerCola(nombreAtraccion) {
    try {
      const cola = await getColaAtraccion(nombreAtraccion);
      setColaSeleccionada({ nombre: nombreAtraccion, ...cola });
    } catch {
      mostrarMensaje("error", "Error al cargar cola");
    }
  }

  if (cargando) return <div className="cargando">Cargando tu panel...</div>;

  return (
    <div className="panel-visitante">
      {/* Header del visitante */}
      <div className="visitante-header">
        <div className="visitante-info">
          <h2>👋 Hola, {usuario.nombre}</h2>
          <p>Documento: {usuario.documento || "—"}</p>
        </div>
        {visitante && (
          <div className="visitante-saldo">
            <span className="saldo-label">Saldo disponible</span>
            <span className="saldo-valor">
              ${visitante.saldo?.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      {/* Tabs de navegación */}
      <div className="tabs">
        {[
          { id: "atracciones", label: "🎢 Atracciones" },
          { id: "tickets", label: "🎟️ Comprar Ticket" },
          { id: "favoritos", label: "⭐ Favoritos" },
          { id: "historial", label: "📋 Historial" },
          { id: "perfil", label: "👤 Mi Perfil" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab ${seccion === tab.id ? "activo" : ""}`}
            onClick={() => setSeccion(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECCIÓN: Atracciones */}
      {seccion === "atracciones" && (
        <div className="seccion">
          <div className="atracciones-grid">
            {atracciones.map((a, i) => (
              <div key={i} className="atraccion-card">
                <div className="card-header">
                  <h4>{a.nombre}</h4>
                  <button
                    className={`btn-favorito ${favoritos.includes(a.nombre) ? "activo" : ""}`}
                    onClick={() => handleToggleFavorito(a.nombre)}
                  >
                    ★
                  </button>
                </div>
                <p className="tipo">{a.tipo}</p>
                <div className="restricciones">
                  <span>👤 +{a.edadMinima} años</span>
                  <span>📏 +{a.alturaMinima}m</span>
                  <span>💰 +${a.costoExtra?.toLocaleString()}</span>
                </div>
                <button
                  className="btn-ver-cola"
                  onClick={() => handleVerCola(a.nombre)}
                >
                  Ver cola
                </button>
              </div>
            ))}
          </div>

          {/* Cola seleccionada */}
          {colaSeleccionada && (
            <div className="cola-detalle">
              <h4>🎢 Cola — {colaSeleccionada.nombre}</h4>
              <p className="cola-numero">
                {colaSeleccionada.personasEnCola} personas esperando
              </p>
              {colaSeleccionada.personasEnCola > 0 && (
                <p>
                  Próximo: <strong>{colaSeleccionada.proximoEnEntrar}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {/* SECCIÓN: Perfil */}
      {seccion === "perfil" && (
        <div className="seccion">
          <div className="perfil-layout">
            {/* Recarga de saldo */}
            <div className="perfil-card">
              <h3>💰 Recargar Saldo</h3>
              {visitante && (
                <div className="saldo-actual">
                  <span className="saldo-label">Saldo actual</span>
                  <span className="saldo-grande">
                    ${visitante.saldo?.toLocaleString()}
                  </span>
                </div>
              )}
              <form onSubmit={handleRecargarSaldo}>
                <div className="form-group">
                  <label>Monto a recargar ($)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    placeholder="Ej: 50000"
                    value={formRecarga.monto}
                    onChange={(e) =>
                      setFormRecarga({
                        monto: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="montos-rapidos">
                  {[10000, 25000, 50000, 100000].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className="btn-monto"
                      onClick={() =>
                        setFormRecarga({
                          monto: String(m),
                        })
                      }
                    >
                      ${m.toLocaleString()}
                    </button>
                  ))}
                </div>
                <button type="submit" className="btn-recargar">
                  Recargar saldo
                </button>
              </form>
            </div>

            {/* Actualizar perfil */}
            <div className="perfil-card">
              <h3>✏️ Editar Perfil</h3>
              {visitante && (
                <div className="perfil-info">
                  <p>
                    <strong>Documento:</strong> {visitante.documento}
                  </p>
                  <p>
                    <strong>Edad:</strong> {visitante.edad} años
                  </p>
                  <p>
                    <strong>Estatura:</strong> {visitante.estatura} m
                  </p>
                </div>
              )}
              <form onSubmit={handleActualizarPerfil}>
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    value={formPerfil.nombre}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        nombre: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formPerfil.email}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nueva contraseña (opcional)</label>
                  <input
                    type="password"
                    placeholder="Dejar vacío para no cambiar"
                    value={formPerfil.contrasena}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        contrasena: e.target.value,
                      })
                    }
                  />
                </div>
                <button type="submit" className="btn-actualizar-perfil">
                  Guardar cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: Comprar Ticket */}
      {seccion === "tickets" && (
        <div className="seccion">
          <div className="panel-compra">
            <h3>Comprar ticket</h3>
            <form onSubmit={handleComprarTicket}>
              <div className="form-group">
                <label>Atracción</label>
                <select
                  value={formTicket.atraccion}
                  onChange={(e) =>
                    setFormTicket({
                      ...formTicket,
                      atraccion: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Selecciona una atracción</option>
                  {atracciones.map((a, i) => (
                    <option key={i} value={a.nombre}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de ticket</label>
                <div className="ticket-opciones">
                  {[
                    { tipo: "GENERAL", precio: 25000, desc: "Acceso estándar" },
                    {
                      tipo: "FAMILIAR",
                      precio: 42500,
                      desc: "15% descuento familiar",
                    },
                    {
                      tipo: "FASTPASS",
                      precio: 80000,
                      desc: "Prioridad máxima",
                    },
                  ].map((t) => (
                    <div
                      key={t.tipo}
                      className={`ticket-opcion ${formTicket.tipo === t.tipo ? "seleccionado" : ""}`}
                      onClick={() =>
                        setFormTicket({ ...formTicket, tipo: t.tipo })
                      }
                    >
                      <span className="ticket-tipo">{t.tipo}</span>
                      <span className="ticket-precio">
                        ${t.precio.toLocaleString()}
                      </span>
                      <span className="ticket-desc">{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-comprar">
                Comprar ticket
              </button>
            </form>

            {colaSeleccionada && (
              <div className="cola-detalle">
                <h4>Cola actualizada — {colaSeleccionada.nombre}</h4>
                <p className="cola-numero">
                  {colaSeleccionada.personasEnCola} personas esperando
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECCIÓN: Favoritos */}
      {seccion === "favoritos" && (
        <div className="seccion">
          <h3>⭐ Mis atracciones favoritas</h3>
          {favoritos.length === 0 ? (
            <div className="vacio">
              <p>No tienes atracciones favoritas aún.</p>
              <p>Ve a la pestaña Atracciones y toca la estrella ☆</p>
            </div>
          ) : (
            <div className="favoritos-lista">
              {favoritos.map((fav, i) => (
                <div key={i} className="favorito-item">
                  <span>⭐ {fav}</span>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleToggleFavorito(fav)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECCIÓN: Historial */}
      {seccion === "historial" && (
        <div className="seccion">
          <h3>📋 Historial de visitas</h3>
          {historial.length === 0 ? (
            <div className="vacio">
              <p>No has visitado ninguna atracción aún.</p>
              <p>Compra un ticket para comenzar</p>
            </div>
          ) : (
            <div className="historial-lista">
              {historial.map((item, i) => (
                <div key={i} className="historial-item">
                  <span className="historial-numero">{i + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PanelVisitante;
