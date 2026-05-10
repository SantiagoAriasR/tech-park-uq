const BASE_URL = "http://localhost:8080/api"

// Listar todas las zonas
export async function getZonas() {
    const res = await fetch(`${BASE_URL}/zonas`)
    return res.json()
}

// Obtener detalle de una zona
export async function getZona(nombre) {
    const res = await fetch(`${BASE_URL}/zonas/${encodeURIComponent(nombre)}`)
    return res.json()
}

// Crear nueva zona
export async function crearZona(zona) {
    const res = await fetch(`${BASE_URL}/zonas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zona)
    })
    return res.json()
}

// Actualizar zona
export async function actualizarZona(nombre, datos) {
    const res = await fetch(`${BASE_URL}/zonas/${encodeURIComponent(nombre)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    return res.json()
}

// Eliminar zona
export async function eliminarZona(nombre) {
    const res = await fetch(`${BASE_URL}/zonas/${encodeURIComponent(nombre)}`, {
        method: "DELETE"
    })
    return res.json()
}

// Asignar atracción a zona
export async function asignarAtraccion(nombreZona, nombreAtraccion) {
    const res = await fetch(
        `${BASE_URL}/zonas/${encodeURIComponent(nombreZona)}/atracciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ atraccion: nombreAtraccion })
    })
    return res.json()
}

// Asignar operador a zona
export async function asignarOperador(nombreZona, documento) {
    const res = await fetch(
        `${BASE_URL}/zonas/${encodeURIComponent(nombreZona)}/operadores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documento })
    })
    return res.json()
}