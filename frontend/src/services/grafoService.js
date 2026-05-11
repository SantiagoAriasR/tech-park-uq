const BASE_URL = "http://localhost:8080/api"

// Obtener estructura del grafo (nodos y aristas)
export async function getEstructuraGrafo() {
    const res = await fetch(`${BASE_URL}/grafo/estructura`)
    return res.json()
}

// Calcular ruta óptima con Dijkstra
export async function getRutaOptima(origen, destino) {
    const res = await fetch(
        `${BASE_URL}/grafo/ruta?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`
    )
    return res.json()
}

// Recorrido BFS desde un nodo
export async function getBFS(inicio) {
    const res = await fetch(
        `${BASE_URL}/grafo/bfs?inicio=${encodeURIComponent(inicio)}`
    )
    return res.json()
}

// Agregar conexión entre dos nodos del grafo
export async function agregarConexion(origen, destino, distancia) {
    const res = await fetch(`${BASE_URL}/grafo/conexion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origen, destino, distancia })
    })
    return res.json()
}

// Obtener nodos del grafo
export async function getNodosGrafo() {
    const res = await fetch(`${BASE_URL}/grafo/nodos`)
    return res.json()
}