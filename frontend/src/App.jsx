import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import "./App.css"

function App() {
    return (
        <div className="app">
            <nav className="navbar">
                <span className="nav-brand">🎢 Tech-Park UQ</span>
                <div className="nav-links">
                    <Link to="/">Inicio</Link>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    )
}

export default App