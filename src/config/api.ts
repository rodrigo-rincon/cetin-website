/**
 * Configuración de la API del backend
 */

export const API_CONFIG = {
  authBaseUrl: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000/api',
  contentBaseUrl: import.meta.env.VITE_CONTENT_API_URL || 'http://localhost:3001/api',
  
  // Endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
    },
    content: {
      getAll: '/content',
      getSection: (section: string) => `/content/${section}`,
      updateSection: (section: string) => `/content/${section}`,
    },
  },
} as const;

/**
 * Obtener la URL completa de un endpoint
 */
export function getEndpointUrl(endpoint: string): string {
  return `${API_CONFIG.contentBaseUrl}${endpoint}`;
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
