/**
 * Configuración de la API del backend
 */

export const API_CONFIG = {
  // URL base del API (se puede configurar via VITE_API_URL)
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Endpoints
  endpoints: {
    auth: {
      login: '/api/auth/login',
    },
    content: {
      getAll: '/api/content',
      getSection: (section: string) => `/api/content/${section}`,
      updateSection: (section: string) => `/api/content/${section}`,
    },
  },
} as const;

/**
 * Obtener la URL completa de un endpoint
 */
export function getEndpointUrl(endpoint: string): string {
  return `${API_CONFIG.baseUrl}${endpoint}`;
}

/**
 * Headers por defecto para requests autenticados
 */
export function getAuthHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}
