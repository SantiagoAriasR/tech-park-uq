const BASE_URL = "http://localhost:8080/api"

// Obtener todos los visitantes
export async function getVisitantes() {
    const res = await fetch(`${BASE_URL}/visitantes`)
    return res.json()
}

// Buscar visitante por documento
export async function getVisitante(documento) {
    const res = await fetch(`${BASE_URL}/visitantes/${documento}`)
    return res.json()
}

// Registrar nuevo visitante
export async function registrarVisitante(visitante) {
    const res = await fetch(`${BASE_URL}/visitantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitante)
    })
    return res.json()
}