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

// Crear nueva atracción
export async function crearAtraccion(atraccion) {
    const res = await fetch(`${BASE_URL}/atracciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atraccion)
    })
    return res.json()
}

// Actualizar datos de atracción
export async function actualizarAtraccion(nombre, datos) {
    const res = await fetch(
        `${BASE_URL}/atracciones/${encodeURIComponent(nombre)}/datos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    return res.json()
}

// Eliminar atracción
export async function eliminarAtraccion(nombre) {
    const res = await fetch(
        `${BASE_URL}/atracciones/${encodeURIComponent(nombre)}`, {
        method: "DELETE"
    })
    return res.json()
}