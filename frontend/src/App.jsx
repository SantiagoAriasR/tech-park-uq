import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Visitantes from "./pages/Visitantes";
import Tickets from "./pages/Tickets";
import Admin from "./pages/Admin";
import GestionAtracciones from "./pages/GestionAtracciones";
import PanelVisitante from "./pages/PanelVisitante";
import PanelOperador from "./pages/PanelOperador";
import MapaParque from "./pages/MapaParque";
import GestionZonas from "./pages/GestionZonas";
import { Link } from "react-router-dom";
import Notificaciones from "./components/Notificaciones";
import Registro from "./pages/Registro"
import "./App.css";

function RutaProtegida({ children, rolesPermitidos }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" />;
  if (!rolesPermitidos.includes(usuario.rol)) return <Navigate to="/login" />;
  return children;
}

function App() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <div className="app">
      {/* Navbar solo visible si hay sesión */}
      {usuario && (
        <nav className="navbar">
          <Link
            to={
              usuario.rol === "VISITANTE"
                ? "/visitante"
                : usuario.rol === "OPERADOR"
                  ? "/operador"
                  : "/admin"
            }
            className="nav-brand"
          >
            🎢 Tech-Park UQ
          </Link>
          <div className="nav-center">
            <span className="nav-rol">{usuario.rol}</span>
            <span className="nav-nombre">{usuario.nombre}</span>
          </div>
          <div className="nav-acciones">
            <Link to="/mapa" className="nav-mapa">
              🗺️ Mapa
            </Link>
            {usuario.rol === "VISITANTE" && (
              <Notificaciones documento={usuario.documento} />
            )}
            <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </nav>
      )}

      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Ruta raíz — redirige según sesión */}
        <Route
          path="/"
          element={
            usuario ? (
              <Navigate
                to={
                  usuario.rol === "VISITANTE"
                    ? "/visitante"
                    : usuario.rol === "OPERADOR"
                      ? "/operador"
                      : "/admin"
                }
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Rutas del Administrador */}
        <Route
          path="/admin"
          element={
            <RutaProtegida rolesPermitidos={["ADMINISTRADOR"]}>
              <Admin />
            </RutaProtegida>
          }
        />
        <Route
          path="/zonas"
          element={
            <RutaProtegida rolesPermitidos={["ADMINISTRADOR"]}>
              <GestionZonas />
            </RutaProtegida>
          }
        />

        {/* Rutas del Visitante — por ahora redirige a Home */}
        <Route
          path="/visitante"
          element={
            <RutaProtegida rolesPermitidos={["VISITANTE"]}>
              <PanelVisitante />
            </RutaProtegida>
          }
        />

        {/* Rutas del Operador — por ahora redirige a Home */}
        <Route
          path="/operador"
          element={
            <RutaProtegida rolesPermitidos={["OPERADOR"]}>
              <PanelOperador />
            </RutaProtegida>
          }
        />

        {/* Rutas compartidas */}
        <Route
          path="/visitantes"
          element={
            <RutaProtegida rolesPermitidos={["ADMINISTRADOR"]}>
              <Visitantes />
            </RutaProtegida>
          }
        />
        <Route
          path="/atracciones"
          element={
            <RutaProtegida rolesPermitidos={["ADMINISTRADOR"]}>
              <GestionAtracciones />
            </RutaProtegida>
          }
        />
        <Route
          path="/tickets"
          element={
            <RutaProtegida rolesPermitidos={["VISITANTE"]}>
              <Tickets />
            </RutaProtegida>
          }
        />
        <Route
          path="/mapa"
          element={
            <RutaProtegida
              rolesPermitidos={["VISITANTE", "ADMINISTRADOR", "OPERADOR"]}
            >
              <MapaParque />
            </RutaProtegida>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
