// src/services/api.js
import axios from "axios";

/**
 * Instancia central de Axios.
 * - Configura la URL base de la API.
 * - Inserta automáticamente el token en cada request.
 * 
 * Esta capa evita repetir lógica en el frontend y mantiene un punto único
 * para controlar headers, errores globales y cualquier comportamiento común.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api"
});

/**
 * Interceptor de petición:
 * - Lee el token almacenado en localStorage (si existe).
 * - Lo adjunta como header Authorization en formato Bearer.
 * 
 * Este patrón asegura que **todas** las solicitudes autenticadas usen
 * el mismo mecanismo sin necesidad de repetir código.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
