const BASE_URL = "http://localhost:8080/api"

export async function login(email, contrasena) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena })
    })
    return res.json()
}