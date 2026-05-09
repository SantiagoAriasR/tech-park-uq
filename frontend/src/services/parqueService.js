const BASE_URL = "http://localhost:8080/api"

// Obtener información general del parque
export async function getInfoParque() {
    const res = await fetch(`${BASE_URL}/parque/info`)
    return res.json()
}

// Obtener todas las zonas
export async function getZonas() {
    const res = await fetch(`${BASE_URL}/parque/zonas`)
    return res.json()
}