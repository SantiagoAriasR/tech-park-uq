import { useState, useEffect, useCallback } from "react";
import {
  getAtracciones,
  crearAtraccion,
  actualizarAtraccion,
  eliminarAtraccion,
} from "../services/atraccionService";
import { getZonas } from "../services/zonaService";
import "./GestionAtracciones.css";
import { agregarConexion, getNodosGrafo } from "../services/grafoService";

const FORM_VACIO = {
  tipo: "MECANICA",
  nombre: "",
  capacidad: "",
  alturaMinima: "",
  edadMinima: "",
  costoExtra: "",
  velocidadMax: "",
  profundidad: "",
  zona: "",
};

function GestionAtracciones() {
  const [atracciones, setAtracciones] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editando, setEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [filtro, setFiltro] = useState("TODAS");
  const [nodosGrafo, setNodosGrafo] = useState([]);
  const [mostrarConexion, setMostrarConexion] = useState(false);
  const [formConexion, setFormConexion] = useState({
    origen: "",
    destino: "",
    distancia: "",
  });

  function mostrarMensaje(tipo, texto) {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  }

  const cargarDatos = useCallback(async () => {
    try {
      const [atr, zon, nodos] = await Promise.all([
        getAtracciones(),
        getZonas(),
        getNodosGrafo(),
      ]);
      setAtracciones(atr);
      setZonas(zon);
      setNodosGrafo(Array.from(nodos.nodos || []));
    } catch {
      mostrarMensaje("error", "Error al cargar datos");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDatos();
  }, [cargarDatos]);

  function handleEditar(atraccion) {
    setEditando(atraccion.nombre);
    setForm({
      ...FORM_VACIO,
      tipo: atraccion.tipo === "MECÁNICA" ? "MECANICA" : "ACUATICA",
      nombre: atraccion.nombre,
      capacidad: atraccion.capacidad,
      alturaMinima: atraccion.alturaMinima,
      edadMinima: atraccion.edadMinima,
      costoExtra: atraccion.costoExtra,
      zona: "",
    });
    setMostrarForm(true);
  }

  function handleNueva() {
    setEditando(null);
    setForm(FORM_VACIO);
    setMostrarForm(true);
  }

  function handleCancelar() {
    setEditando(null);
    setForm(FORM_VACIO);
    setMostrarForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let resultado;
      if (editando) {
        resultado = await actualizarAtraccion(editando, {
          capacidad: parseInt(form.capacidad),
          alturaMinima: parseFloat(form.alturaMinima),
          edadMinima: parseInt(form.edadMinima),
          costoExtra: parseFloat(form.costoExtra),
        });
      } else {
        const datos = {
          tipo: form.tipo,
          nombre: form.nombre,
          capacidad: parseInt(form.capacidad),
          alturaMinima: parseFloat(form.alturaMinima),
          edadMinima: parseInt(form.edadMinima),
          costoExtra: parseFloat(form.costoExtra),
          zona: form.zona,
        };
        if (form.tipo === "MECANICA") {
          datos.velocidadMax = parseFloat(form.velocidadMax);
        } else {
          datos.profundidad = parseFloat(form.profundidad);
        }
        resultado = await crearAtraccion(datos);
      }

      if (resultado.exito) {
        mostrarMensaje("exito", resultado.mensaje);
        handleCancelar();
        cargarDatos();
      } else {
        mostrarMensaje("error", resultado.mensaje);
      }
    } catch {
      mostrarMensaje("error", "Error al guardar la atracción");
    }
  }

  async function handleAgregarConexion(e) {
    e.preventDefault();
    try {
      const resultado = await agregarConexion(
        formConexion.origen,
        formConexion.destino,
        parseInt(formConexion.distancia),
      );
      if (resultado.exito) {
        mostrarMensaje("exito", resultado.mensaje);
        setFormConexion({ origen: "", destino: "", distancia: "" });
        setMostrarConexion(false);
        cargarDatos();
      } else {
        mostrarMensaje("error", resultado.mensaje);
      }
    } catch {
      mostrarMensaje("error", "Error al agregar conexión");
    }
  }

  async function handleEliminar(nombre) {
    try {
      const resultado = await eliminarAtraccion(nombre);
      if (resultado.exito) {
        mostrarMensaje("exito", resultado.mensaje);
        setConfirmEliminar(null);
        cargarDatos();
      } else {
        mostrarMensaje("error", resultado.mensaje);
      }
    } catch {
      mostrarMensaje("error", "Error al eliminar");
    }
  }

  function getBadgeEstado(estado) {
    const map = {
      ACTIVA: { bg: "#e8f5e9", color: "#28a745", texto: "✅ Activa" },
      EN_MANTENIMIENTO: { bg: "#fff8e1", color: "#f59e0b", texto: "🔧 Mant." },
      CERRADA: { bg: "#fdecea", color: "#dc3545", texto: "❌ Cerrada" },
    };
    return map[estado] || map.CERRADA;
  }

  const atraccionesFiltradas = atracciones.filter((a) => {
    if (filtro === "TODAS") return true;
    if (filtro === "ACTIVA") return a.estado === "ACTIVA";
    if (filtro === "CERRADA") return a.estado === "CERRADA";
    if (filtro === "MECANICA") return a.tipo === "MECÁNICA";
    if (filtro === "ACUATICA") return a.tipo === "ACUÁTICA";
    return true;
  });

  if (cargando) return <div className="cargando">Cargando atracciones...</div>;

  return (
    <div className="gestion-atracciones">
      <div className="ga-header">
        <h2>🎢 Gestión de Atracciones</h2>
        <button
          className="btn-conexion"
          onClick={() => {
            setMostrarConexion(!mostrarConexion);
            setMostrarForm(false);
          }}
        >
          🔗 Conectar en mapa
        </button>
        <button className="btn-nueva" onClick={handleNueva}>
          + Nueva atracción
        </button>
      </div>

      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      {/* Formulario */}
      {mostrarForm && (
        <div className="ga-form-container">
          <h3>{editando ? `Editar — ${editando}` : "Nueva atracción"}</h3>
          <form onSubmit={handleSubmit} className="ga-form">
            {!editando && (
              <div className="form-group">
                <label>Tipo de atracción</label>
                <div className="tipo-opciones">
                  {["MECANICA", "ACUATICA"].map((t) => (
                    <div
                      key={t}
                      className={`tipo-opcion ${form.tipo === t ? "seleccionado" : ""}`}
                      onClick={() => setForm({ ...form, tipo: t })}
                    >
                      <span>
                        {t === "MECANICA" ? "⚙️ Mecánica" : "💧 Acuática"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-grid">
              {!editando && (
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    placeholder="Ej: Tornado Extremo"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nombre: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label>Capacidad (personas)</label>
                <input
                  type="number"
                  min="1"
                  value={form.capacidad}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      capacidad: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Altura mínima (metros)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.alturaMinima}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      alturaMinima: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Edad mínima (años)</label>
                <input
                  type="number"
                  min="0"
                  value={form.edadMinima}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      edadMinima: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Costo extra ($)</label>
                <input
                  type="number"
                  min="0"
                  value={form.costoExtra}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      costoExtra: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {!editando && form.tipo === "MECANICA" && (
                <div className="form-group">
                  <label>Velocidad máxima (km/h)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.velocidadMax}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        velocidadMax: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}

              {!editando && form.tipo === "ACUATICA" && (
                <div className="form-group">
                  <label>Profundidad máxima (metros)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.profundidad}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profundidad: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}

              {!editando && (
                <div className="form-group">
                  <label>Zona</label>
                  <select
                    value={form.zona}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        zona: e.target.value,
                      })
                    }
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
              )}
            </div>

            <div className="form-botones">
              <button type="submit" className="btn-guardar">
                {editando ? "Guardar cambios" : "Crear atracción"}
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

      {/* Formulario conectar nodos del grafo */}
      {mostrarConexion && (
        <div className="ga-form-container">
          <h3>🔗 Conectar atracciones en el mapa</h3>
          <p className="form-desc">
            Cuando crees una atracción nueva conéctala con otras para que
            aparezca en el mapa con sus rutas correctas.
          </p>
          <form onSubmit={handleAgregarConexion}>
            <div className="form-grid">
              <div className="form-group">
                <label>Desde</label>
                <select
                  value={formConexion.origen}
                  onChange={(e) =>
                    setFormConexion({
                      ...formConexion,
                      origen: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Selecciona nodo origen</option>
                  {nodosGrafo.map((n, i) => (
                    <option key={i} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Hasta</label>
                <select
                  value={formConexion.destino}
                  onChange={(e) =>
                    setFormConexion({
                      ...formConexion,
                      destino: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Selecciona nodo destino</option>
                  {nodosGrafo.map((n, i) => (
                    <option key={i} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Distancia (metros)</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 200"
                  value={formConexion.distancia}
                  onChange={(e) =>
                    setFormConexion({
                      ...formConexion,
                      distancia: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-botones">
              <button type="submit" className="btn-guardar">
                Agregar conexión
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setMostrarConexion(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      {!mostrarForm && (
        <div className="filtros">
          {["TODAS", "ACTIVA", "CERRADA", "MECANICA", "ACUATICA"].map((f) => (
            <button
              key={f}
              className={`filtro ${filtro === f ? "activo" : ""}`}
              onClick={() => setFiltro(f)}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Tabla de atracciones */}
      {!mostrarForm && (
        <div className="tabla-container">
          <table className="tabla-atracciones">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Capacidad</th>
                <th>Edad mín</th>
                <th>Altura mín</th>
                <th>Costo extra</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {atraccionesFiltradas.map((a, i) => {
                const badge = getBadgeEstado(a.estado);
                return (
                  <tr key={i}>
                    <td>
                      <strong>{a.nombre}</strong>
                    </td>
                    <td>{a.tipo}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {badge.texto}
                      </span>
                    </td>
                    <td>{a.capacidad}</td>
                    <td>{a.edadMinima} años</td>
                    <td>{a.alturaMinima}m</td>
                    <td>${a.costoExtra?.toLocaleString()}</td>
                    <td>
                      <div className="acciones">
                        <button
                          className="btn-editar"
                          onClick={() => handleEditar(a)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => setConfirmEliminar(a.nombre)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal confirmar eliminar */}
      {confirmEliminar && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠️ Confirmar eliminación</h3>
            <p>
              ¿Eliminar la atracción <strong>{confirmEliminar}</strong>?
            </p>
            <p className="modal-advertencia">
              La atracción quedará marcada como CERRADA y se eliminará de su
              zona.
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
  );
}

export default GestionAtracciones;
