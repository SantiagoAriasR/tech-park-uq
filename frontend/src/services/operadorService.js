const BASE_URL = "http://localhost:8080/api"

// Obtener atracciones de la zona del operador
export async function getAtraccionesOperador(documento) {
    const res = await fetch(`${BASE_URL}/operador/${documento}/atraccion`)
    return res.json()
}

// Ver cola detallada de una atracción
export async function getColaOperador(nombreAtraccion) {
    const res = await fetch(`${BASE_URL}/operador/cola/${nombreAtraccion}`)
    return res.json()
}

// Validar acceso de un visitante
export async function validarAcceso(documento, atraccion) {
    const res = await fetch(`${BASE_URL}/operador/validar-acceso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documento, atraccion })
    })
    return res.json()
}

// Cambiar estado de una atracción
export async function cambiarEstadoAtraccion(nombre, estado, motivo) {
    const res = await fetch(`${BASE_URL}/operador/atraccion/${nombre}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, motivo })
    })
    return res.json()
}