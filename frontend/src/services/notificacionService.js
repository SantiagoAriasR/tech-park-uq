const BASE_URL = "http://localhost:8080/api"

// Obtener notificaciones de un visitante
export async function getNotificaciones(documento) {
    const res = await fetch(`${BASE_URL}/notificaciones/${documento}`)
    return res.json()
}

// Contar notificaciones no leídas
export async function contarNoLeidas(documento) {
    const res = await fetch(`${BASE_URL}/notificaciones/${documento}/count`)
    return res.json()
}

// Marcar notificación como leída
export async function marcarLeida(id) {
    const res = await fetch(`${BASE_URL}/notificaciones/${id}/leer`, {
        method: "PUT"
    })
    return res.json()
}