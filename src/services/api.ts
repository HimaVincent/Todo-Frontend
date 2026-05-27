const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1").replace(/\/$/, "");

export async function apiRequest(path: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
