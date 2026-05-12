const BASE_URL = "http://localhost:8080/api/admin"

export async function getOperadores() {
    const res = await fetch(`${BASE_URL}/operadores`)
    return res.json()
}

export async function crearOperador(operador) {
    const res = await fetch(`${BASE_URL}/operadores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(operador)
    })
    return res.json()
}

export async function actualizarOperador(documento, datos) {
    const res = await fetch(`${BASE_URL}/operadores/${documento}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    return res.json()
}

export async function eliminarOperador(documento) {
    const res = await fetch(`${BASE_URL}/operadores/${documento}`, {
        method: "DELETE"
    })
    return res.json()
}