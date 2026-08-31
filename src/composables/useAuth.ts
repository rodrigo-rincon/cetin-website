import { ref } from 'vue';
import { API_CONFIG } from '../config/api';

const token = ref<string | null>(localStorage.getItem('cetin_jwt_token'));
const isAuthenticated = ref<boolean>(!!token.value);
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useAuth() {
  /**
   * Hacer login en el backend
   */
  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error('Login failed: ' + response.statusText);
      }

      const data = await response.json();
      const jwtToken = data.token;

      if (!jwtToken) {
        throw new Error('No token received from server');
      }

      // Guardar token
      localStorage.setItem('cetin_jwt_token', jwtToken);
      token.value = jwtToken;
      isAuthenticated.value = true;

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Login error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Logout
   */
  function logout(): void {
    localStorage.removeItem('cetin_jwt_token');
    token.value = null;
    isAuthenticated.value = false;
  }

  /**
   * Obtener el token actual
   */
  function getToken(): string | null {
    return token.value;
  }

  /**
   * Verificar si hay sesión activa
   */
  function checkAuth(): boolean {
    const stored = localStorage.getItem('cetin_jwt_token');
    if (stored) {
      token.value = stored;
      isAuthenticated.value = true;
      return true;
    }
    isAuthenticated.value = false;
    return false;
  }

  return {
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    getToken,
    checkAuth,
  };
}
