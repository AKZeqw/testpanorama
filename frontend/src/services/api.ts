// API Client layer dasar untuk integrasi REST API backend Flask
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api'

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  try {
    const response = await fetch(url, { ...options, headers })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json() as T
  } catch (error) {
    console.warn(`[API] Fallback ke local data store: ${endpoint}`, error)
    throw error
  }
}
