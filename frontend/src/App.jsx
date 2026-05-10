import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Visitantes from "./pages/Visitantes";
import Tickets from "./pages/Tickets";
import Admin from "./pages/Admin";
import PanelVisitante from "./pages/PanelVisitante";
import PanelOperador from "./pages/PanelOperador";
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
          <span className="nav-brand">🎢 Tech-Park UQ</span>
          <div className="nav-center">
            <span className="nav-rol">{usuario.rol}</span>
            <span className="nav-nombre">{usuario.nombre}</span>
          </div>
          <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </nav>
      )}

      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

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
          path="/tickets"
          element={
            <RutaProtegida rolesPermitidos={["VISITANTE"]}>
              <Tickets />
            </RutaProtegida>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
