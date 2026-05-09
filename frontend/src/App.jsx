import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Visitantes from "./pages/Visitantes"
import Admin from "./pages/Admin"
import Tickets from "./pages/Tickets"
import "./App.css"

function App() {
    return (
        <div className="app">
            <nav className="navbar">
                <span className="nav-brand">🎢 Tech-Park UQ</span>
                <div className="nav-links">
                    <Link to="/">Inicio</Link>
                    <Link to="/visitantes">Visitantes</Link>
                    <Link to="/admin">Admin</Link>
                    <Link to="/tickets">Tickets</Link>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/visitantes" element={<Visitantes />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/tickets" element={<Tickets />} />
            </Routes>
        </div>
    )
}

export default App