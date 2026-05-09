import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Visitantes from "./pages/Visitantes"
import "./App.css"

function App() {
    return (
        <div className="app">
            <nav className="navbar">
                <span className="nav-brand">🎢 Tech-Park UQ</span>
                <div className="nav-links">
                    <Link to="/">Inicio</Link>
                    <Link to="/visitantes">Visitantes</Link>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/visitantes" element={<Visitantes />} />
            </Routes>
        </div>
    )
}

export default App