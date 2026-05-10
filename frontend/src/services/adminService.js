const BASE_URL = "http://localhost:8080/api"

// Obtener alerta climática actual
export async function getAlertaClimatica() {
    const res = await fetch(`${BASE_URL}/admin/alerta-climatica`)
    return res.json()
}

// Activar alerta climática
export async function activarAlerta(tipo, descripcion) {
    const res = await fetch(`${BASE_URL}/admin/alerta-climatica`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, descripcion })
    })
    return res.json()
}

// Desactivar alerta climática
export async function desactivarAlerta() {
    const res = await fetch(`${BASE_URL}/admin/alerta-climatica`, {
        method: "DELETE"
    })
    return res.json()
}

// Obtener reporte de jornada
export async function getReporte() {
    const res = await fetch(`${BASE_URL}/admin/reporte`)
    return res.json()
}