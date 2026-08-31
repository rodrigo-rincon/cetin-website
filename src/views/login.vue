<template>
  <div style="min-height:100vh;display:flex;background:#0f2a5c;">
    <!-- Left side - Branding -->
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;background:linear-gradient(135deg, #0f2a5c 0%, #1a4a8a 100%);padding:40px;position:relative;overflow:hidden;">
      <!-- Decorative circles -->
      <div style="position:absolute;top:10%;left:10%;width:200px;height:200px;border:2px solid rgba(255,255,255,0.1);border-radius:50%;"></div>
      <div style="position:absolute;bottom:20%;right:10%;width:150px;height:150px;border:2px solid rgba(233,30,140,0.3);border-radius:50%;"></div>
      <div style="position:absolute;top:40%;right:30%;width:80px;height:80px;background:rgba(233,30,140,0.2);border-radius:50%;"></div>
      
      <div style="text-align:center;z-index:1;">
        <div style="width:80px;height:80px;background:#e91e8c;border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;box-shadow:0 10px 40px rgba(233,30,140,0.4);">
          <svg style="width:40px;height:40px;fill:#fff;" viewBox="0 0 24 24">
            <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
          </svg>
        </div>
        <h1 style="font-size:36px;font-weight:800;color:#fff;margin:0 0 8px;font-family:'Outfit',sans-serif;">CETIN</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:16px;margin:0;">Centro de Tamizaje Infantil</p>
      </div>
    </div>

    <!-- Right side - Login Form -->
    <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#f8fafc;padding:40px;">
      <div style="width:100%;max-width:400px;">
        <div style="margin-bottom:32px;">
          <h2 style="font-size:28px;font-weight:700;color:#0f2a5c;margin:0 0 8px;font-family:'Outfit',sans-serif;">Bienvenido</h2>
          <p style="color:#64748b;font-size:16px;margin:0;">Ingresa tus credenciales para continuar</p>
        </div>

        <form @submit.prevent="handleLogin" style="display:flex;flex-direction:column;gap:20px;">
          <div>
            <label for="email" style="display:block;font-size:14px;font-weight:600;color:#374151;margin-bottom:8px;">Email</label>
            <div style="position:relative;">
              <svg style="position:absolute;left:16px;top:50%;transform:translateY(-50%);width:20px;height:20px;#9ca3af;fill:#9ca3af;" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                placeholder="correo@ejemplo.com"
                required 
                style="width:100%;padding:16px 16px 16px 48px;border:2px solid #e2e8f0;border-radius:12px;font-size:16px;transition:border-color 0.2s,box-shadow 0.2s;outline:none;box-sizing:border-box;"
                @focus="setBorderColor($event, '#e91e8c')"
                @blur="setBorderColor($event, '#e2e8f0')"
              />
            </div>
          </div>

          <div>
            <label for="password" style="display:block;font-size:14px;font-weight:600;color:#374151;margin-bottom:8px;">Password</label>
            <div style="position:relative;">
              <svg style="position:absolute;left:16px;top:50%;transform:translateY(-50%);width:20px;height:20px;#9ca3af;fill:#9ca3af;" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input 
                id="password" 
                v-model="password" 
                type="password" 
                placeholder="••••••••"
                required 
                style="width:100%;padding:16px 16px 16px 48px;border:2px solid #e2e8f0;border-radius:12px;font-size:16px;transition:border-color 0.2s,box-shadow 0.2s;outline:none;box-sizing:border-box;"
                @focus="setBorderColor($event, '#e91e8c')"
                @blur="setBorderColor($event, '#e2e8f0')"
              />
            </div>
          </div>

          <button 
            type="submit" 
            style="width:100%;background:linear-gradient(135deg, #e91e8c 0%, #d4177d 100%);color:#fff;font-weight:600;padding:16px;border-radius:12px;border:none;cursor:pointer;font-size:16px;box-shadow:0 4px 15px rgba(233,30,140,0.3);transition:transform 0.2s,box-shadow 0.2s;"
            @mouseover="setTransform($event, 'translateY(-2px)')"
            @mouseout="setTransform($event, 'translateY(0)')"
          >
            Iniciar Sesión
          </button>

          <button
            v-if="isLocalPreviewEnabled"
            type="button"
            style="width:100%;background:#fff;color:#0f2a5c;font-weight:600;padding:14px;border-radius:12px;border:2px solid #0f2a5c;cursor:pointer;font-size:15px;"
            @click="handleLocalPreview"
          >
            Ver gestor en modo demostración
          </button>
          
          <p v-if="error" style="color:#ef4444;font-size:14px;text-align:center;padding:12px;background:#fef2f2;border-radius:8px;">{{ error }}</p>
        </form>

        <div style="margin-top:32px;text-align:center;">
          <a href="/" style="color:#64748b;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;">
            <svg style="width:16px;height:16px;fill:currentColor;" viewBox="0 0 24 24">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';

const { login, loginForLocalPreview, error } = useAuth();
const router = useRouter();
const email = ref('');
const password = ref('');
const isLocalPreviewEnabled = import.meta.env.DEV && import.meta.env.VITE_DEV_ADMIN_BYPASS === 'true';

function setBorderColor(event: Event, color: string) {
  (event.currentTarget as HTMLElement).style.borderColor = color;
}

function setTransform(event: Event, transform: string) {
  (event.currentTarget as HTMLElement).style.transform = transform;
}

async function handleLogin() {
  const success = await login(email.value, password.value);
  if (success) {
    router.push('/admin');
  }
}

function handleLocalPreview() {
  if (loginForLocalPreview()) router.push('/admin');
}
</script>
