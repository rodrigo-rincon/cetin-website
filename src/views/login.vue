<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';
import loginBackground from '../assets/images/cetin-login-background.png';
import cetinLogo from '../assets/images/cetin_logo.png';

const { login, loginForLocalPreview, error } = useAuth();
const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const isLocalPreviewEnabled = import.meta.env.DEV && import.meta.env.VITE_DEV_ADMIN_BYPASS === 'true';

async function handleLogin() {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    if (await login(email.value, password.value)) await router.push('/admin');
  } finally {
    isLoading.value = false;
  }
}

function handleLocalPreview() {
  if (loginForLocalPreview()) router.push('/admin');
}
</script>

<template>
  <main class="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#edf6fd] px-4 py-7 transition-colors dark:bg-slate-950 sm:px-8 lg:px-0">
    <img :src="loginBackground" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover object-[38%_center] lg:object-center" />
    <div class="absolute inset-0 bg-white/30 transition-colors dark:bg-slate-950/45 sm:bg-white/15 lg:bg-transparent"></div>

    <section class="relative z-10 w-full max-w-[475px] rounded-[24px] border border-white/90 bg-white/[0.88] px-7 py-9 shadow-[0_22px_70px_rgba(49,95,143,0.16)] backdrop-blur-xl transition-colors dark:border-slate-700/80 dark:bg-slate-900/[0.92] dark:shadow-black/35 sm:px-11 sm:py-10 lg:absolute lg:left-[50.4%] lg:top-1/2 lg:-translate-y-1/2">
      <div class="text-center">
        <div class="mx-auto mb-2 flex h-28 w-28 items-center justify-center">
          <img :src="cetinLogo" class="h-28 w-28 object-contain" alt="CETIN" />
        </div>
        <h1 class="text-[28px] font-extrabold tracking-tight text-[#0f2a5c] dark:text-white">Bienvenido</h1>
        <p class="mt-1.5 text-[15px] text-slate-500 dark:text-slate-400">Inicia sesión para continuar</p>
      </div>

      <form class="mt-7 space-y-4" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="sr-only">Correo electrónico</label>
          <div class="relative">
            <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m7-10a4 4 0 100-8 4 4 0 000 8z" /></svg>
            <input id="email" v-model.trim="email" type="email" autocomplete="username" placeholder="Correo electrónico" required class="h-14 w-full rounded-xl border border-slate-200 bg-white/65 pl-12 pr-4 text-[15px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#3296d4] focus:bg-white focus:ring-4 focus:ring-blue-100/80 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:bg-slate-800 dark:focus:ring-sky-500/20" />
          </div>
        </div>

        <div>
          <label for="password" class="sr-only">Contraseña</label>
          <div class="relative">
            <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 10V8a6 6 0 0112 0v2m-13 0h14a2 2 0 012 2v8H3v-8a2 2 0 012-2z" /></svg>
            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Contraseña" required class="h-14 w-full rounded-xl border border-slate-200 bg-white/65 pl-12 pr-12 text-[15px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#3296d4] focus:bg-white focus:ring-4 focus:ring-blue-100/80 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:bg-slate-800 dark:focus:ring-sky-500/20" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#0f5fa0] dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-sky-300" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" @click="showPassword = !showPassword">
              <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.2A10.7 10.7 0 0112 4c5 0 8.5 4 9.5 6.3a4 4 0 010 3.4 14 14 0 01-2 3M6.6 6.6A14.3 14.3 0 002.5 10.3a4 4 0 000 3.4C3.5 16 7 20 12 20a10.7 10.7 0 004.1-.8" /></svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.5 12S6 5 12 5s9.5 7 9.5 7S18 19 12 19 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" stroke-width="1.8" /></svg>
            </button>
          </div>
        </div>

        <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2.5 text-center text-sm text-red-600 dark:bg-red-950/45 dark:text-red-300">{{ error }}</p>

        <button type="submit" :disabled="isLoading" class="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#147fc8] to-[#2999dc] text-[15px] font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
          <svg v-if="isLoading" class="h-5 w-5 animate-spin" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" /></svg>
          {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </button>

        <button v-if="isLocalPreviewEnabled" type="button" class="w-full rounded-xl border border-[#0f2a5c]/25 bg-white/70 px-5 py-3 text-sm font-semibold text-[#0f2a5c] transition hover:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700" @click="handleLocalPreview">Ver gestor en modo demostración</button>
      </form>

      <div class="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3l7 3v5c0 4.6-2.9 8-7 10-4.1-2-7-5.4-7-10V6l7-3z" /></svg>
        Acceso exclusivo para personal autorizado
      </div>
      <a href="/" class="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 transition hover:text-[#0f5fa0] dark:text-slate-400 dark:hover:text-sky-300">← Volver al inicio</a>
    </section>
  </main>
</template>
