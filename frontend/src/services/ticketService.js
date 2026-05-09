const BASE_URL = "http://localhost:8080/api"

// Comprar un ticket
export async function comprarTicket(documento, tipo, atraccion) {
    const res = await fetch(`${BASE_URL}/tickets/comprar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documento, tipo, atraccion })
    })
    return res.json()
}

// Ver la cola de una atracción
export async function getColaAtraccion(nombreAtraccion) {
    const res = await fetch(`${BASE_URL}/tickets/cola/${nombreAtraccion}`)
    return res.json()
}

// Dejar pasar al siguiente en la cola
export async function dejarPasar(nombreAtraccion) {
    const res = await fetch(`${BASE_URL}/tickets/cola/${nombreAtraccion}/siguiente`, {
        method: "DELETE"
    })
    return res.json()
}