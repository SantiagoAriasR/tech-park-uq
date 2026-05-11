const BASE_URL = "http://localhost:8080/api"

// Obtener todas las revisiones
export async function getRevisiones() {
    const res = await fetch(`${BASE_URL}/revisiones`)
    return res.json()
}

// Obtener revisiones de una atracción específica
export async function getRevisionesPorAtraccion(atraccion) {
    const res = await fetch(
        `${BASE_URL}/revisiones/${encodeURIComponent(atraccion)}`
    )
    return res.json()
}

// Registrar nueva revisión
export async function registrarRevision(datos) {
    const res = await fetch(`${BASE_URL}/revisiones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    return res.json()
}