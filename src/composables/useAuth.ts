import { ref } from 'vue';
import { API_CONFIG } from '../config/api';

const token = ref<string | null>(localStorage.getItem('cetin_jwt_token'));
const isAuthenticated = ref<boolean>(!!token.value);
const isLoading = ref(false);
const error = ref<string | null>(null);
const ROLE_KEY = 'cetin_user_role';

export function useAuth() {
  /**
   * Hacer login en el backend
   */
  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        `${API_CONFIG.authBaseUrl}${API_CONFIG.endpoints.auth.login}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo: email, contrasena: password }),
        }
      );

      if (!response.ok) {
        throw new Error('Login failed: ' + response.statusText);
      }

      const responseBody = await response.json();
      const data = responseBody.data || responseBody;
      const jwtToken = data.token;
      const role = data.user?.rol || data.user?.role;

      if (!jwtToken) {
        throw new Error('No token received from server');
      }
      if (role !== 'superadmin') {
        throw new Error('Solo los superadministradores pueden acceder al gestor');
      }

      // Guardar token
      localStorage.setItem('cetin_jwt_token', jwtToken);
      localStorage.setItem(ROLE_KEY, role);
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
    localStorage.removeItem(ROLE_KEY);
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
    if (stored && localStorage.getItem(ROLE_KEY) === 'superadmin') {
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
