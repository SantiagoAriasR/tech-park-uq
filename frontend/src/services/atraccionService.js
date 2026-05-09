const BASE_URL = "http://localhost:8080/api"

// Obtener todas las atracciones
export async function getAtracciones() {
    const res = await fetch(`${BASE_URL}/atracciones`)
    return res.json()
}

// Buscar atracción por nombre
export async function getAtraccion(nombre) {
    const res = await fetch(`${BASE_URL}/atracciones/${nombre}`)
    return res.json()
}

// Cambiar estado de una atracción
export async function cambiarEstadoAtraccion(nombre, estado) {
    const res = await fetch(`${BASE_URL}/atracciones/${nombre}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado })
    })
    return res.json()
}