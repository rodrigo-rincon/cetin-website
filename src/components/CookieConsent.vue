<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useCookieConsent } from '../composables/useCookieConsent';
import doctorCetin from '../assets/images/dr-blue/dr-cetin-02.png';

const { preferences, hasDecision, acceptAll, acceptNecessary, savePreferences } = useCookieConsent();
const visible = ref(!hasDecision.value);
const configuring = ref(false);
const externalMedia = ref(preferences.value?.externalMedia ?? true);

watch(preferences, (value) => {
	externalMedia.value = value?.externalMedia ?? true;
});

const closeAfter = (action: () => void) => {
	action();
	visible.value = false;
	configuring.value = false;
};

const openSettings = () => {
	externalMedia.value = preferences.value?.externalMedia ?? true;
	visible.value = true;
	configuring.value = true;
};

const save = () => closeAfter(() => savePreferences(externalMedia.value));

onMounted(() => window.addEventListener('open-cetin-cookie-settings', openSettings));
onBeforeUnmount(() => window.removeEventListener('open-cetin-cookie-settings', openSettings));
</script>

<template>
	<Transition name="cookie-card">
		<aside v-if="visible" class="cookie-consent" aria-live="polite" aria-label="Preferencias de privacidad">
			<div class="cookie-consent__accent" aria-hidden="true"></div>
			<img :src="doctorCetin" alt="" class="cookie-consent__doctor" aria-hidden="true" />

			<div class="cookie-consent__content">
				<p class="cookie-consent__eyebrow">Tu privacidad también importa</p>
				<h2>{{ configuring ? 'Elige qué contenido cargar' : 'Cuidamos tus datos' }}</h2>
				<p v-if="!configuring" class="cookie-consent__copy">
					Usamos almacenamiento necesario para que el sitio funcione. Con tu permiso también cargamos videos y mapas externos.
				</p>

				<div v-else class="cookie-preferences">
					<div class="cookie-preference">
						<div><strong>Necesarias</strong><span>Tema, seguridad y funcionamiento básico</span></div>
						<span class="cookie-preference__required">Siempre activas</span>
					</div>
					<label class="cookie-preference">
						<div><strong>Contenido externo</strong><span>Videos de YouTube y mapa de sucursales</span></div>
						<input v-model="externalMedia" type="checkbox" class="sr-only" />
						<span class="cookie-switch" :class="{ 'is-active': externalMedia }" aria-hidden="true"><span></span></span>
					</label>
				</div>

				<div class="cookie-consent__actions">
					<template v-if="!configuring">
						<button type="button" class="cookie-button cookie-button--primary" @click="closeAfter(acceptAll)">Aceptar todas</button>
						<button type="button" class="cookie-button cookie-button--secondary" @click="closeAfter(acceptNecessary)">Solo necesarias</button>
						<button type="button" class="cookie-button cookie-button--link" @click="configuring = true">Configurar</button>
					</template>
					<template v-else>
						<button type="button" class="cookie-button cookie-button--primary" @click="save">Guardar preferencias</button>
						<button v-if="!hasDecision" type="button" class="cookie-button cookie-button--link" @click="configuring = false">Volver</button>
						<button v-else type="button" class="cookie-button cookie-button--link" @click="visible = false">Cancelar</button>
					</template>
				</div>

				<router-link to="/politica-de-cookies" class="cookie-consent__policy">Consultar la política de cookies</router-link>
			</div>
		</aside>
	</Transition>
</template>

<style scoped>
.cookie-consent { position: fixed; z-index: 80; right: 1.5rem; bottom: 1.5rem; width: min(31rem, calc(100vw - 3rem)); overflow: hidden; border: 1px solid rgb(15 42 92 / .12); border-radius: 1.25rem; background: rgb(255 255 255 / .97); box-shadow: 0 24px 64px rgb(15 42 92 / .2); color: #0f2a5c; backdrop-filter: blur(18px); }
.cookie-consent__accent { height: .35rem; background: linear-gradient(90deg, #ec4899 0 34%, #3b82f6 34% 68%, #fbbf24 68%); }
.cookie-consent__doctor { position: absolute; right: -.35rem; top: .7rem; width: 7.5rem; height: 7.5rem; object-fit: contain; object-position: top; pointer-events: none; }
.cookie-consent__content { position: relative; padding: 1.5rem; padding-right: 7.5rem; }
.cookie-consent__eyebrow { color: #db2777; font-size: .78rem; font-weight: 700; }
.cookie-consent h2 { margin-top: .3rem; max-width: 18rem; font-size: 1.55rem; font-weight: 650; line-height: 1.1; }
.cookie-consent__copy { margin-top: .75rem; color: #475569; font-size: .92rem; line-height: 1.55; }
.cookie-consent__actions { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: 1.15rem; }
.cookie-button { min-height: 2.65rem; border-radius: .65rem; padding: .65rem 1rem; font-size: .84rem; font-weight: 650; }
.cookie-button--primary { background: #db2777; color: white; }
.cookie-button--primary:hover { background: #be185d; }
.cookie-button--secondary { border: 1px solid #cbd5e1; background: white; color: #0f2a5c; }
.cookie-button--secondary:hover { border-color: #94a3b8; background: #f8fafc; }
.cookie-button--link { padding-inline: .35rem; color: #475569; text-decoration: underline; text-decoration-color: rgb(71 85 105 / .3); text-underline-offset: 3px; }
.cookie-consent__policy { display: inline-block; margin-top: .85rem; color: #64748b; font-size: .76rem; text-decoration: underline; text-underline-offset: 3px; }
.cookie-preferences { display: grid; gap: .65rem; margin-top: 1rem; margin-right: -6rem; }
.cookie-preference { display: flex; min-height: 4rem; align-items: center; justify-content: space-between; gap: 1rem; border: 1px solid #e2e8f0; border-radius: .8rem; padding: .8rem; background: #f8fafc; }
.cookie-preference div { display: grid; gap: .15rem; }
.cookie-preference strong { font-size: .86rem; }
.cookie-preference div span { color: #64748b; font-size: .75rem; line-height: 1.35; }
.cookie-preference__required { flex: 0 0 auto; color: #64748b; font-size: .7rem; font-weight: 650; }
.cookie-switch { display: flex; width: 2.8rem; height: 1.55rem; flex: 0 0 auto; align-items: center; border-radius: 999px; padding: .18rem; background: #cbd5e1; transition: background-color 180ms ease; }
.cookie-switch span { width: 1.18rem; height: 1.18rem; border-radius: 50%; background: white; box-shadow: 0 2px 5px rgb(15 23 42 / .24); transition: transform 180ms ease; }
.cookie-switch.is-active { background: #db2777; }
.cookie-switch.is-active span { transform: translateX(1.24rem); }
.cookie-card-enter-active, .cookie-card-leave-active { transition: opacity 280ms ease, transform 420ms cubic-bezier(.22, 1, .36, 1); }
.cookie-card-enter-from, .cookie-card-leave-to { opacity: 0; transform: translateY(2rem) rotate(1.5deg) scale(.96); }
:global(.dark) .cookie-consent { border-color: rgb(148 163 184 / .2); background: rgb(15 23 42 / .97); box-shadow: 0 24px 64px rgb(0 0 0 / .4); color: white; }
:global(.dark) .cookie-consent__copy { color: #cbd5e1; }
:global(.dark) .cookie-button--secondary { border-color: #475569; background: #1e293b; color: white; }
:global(.dark) .cookie-button--secondary:hover { background: #334155; }
:global(.dark) .cookie-button--link, :global(.dark) .cookie-consent__policy { color: #cbd5e1; }
:global(.dark) .cookie-preference { border-color: #334155; background: #1e293b; }
:global(.dark) .cookie-preference div span, :global(.dark) .cookie-preference__required { color: #cbd5e1; }
@media (max-width: 639px) { .cookie-consent { right: .75rem; bottom: .75rem; width: calc(100vw - 1.5rem); } .cookie-consent__doctor { width: 6.4rem; height: 6.4rem; } .cookie-consent__content { padding: 1.25rem; padding-right: 6.25rem; } .cookie-preferences { margin-right: -5rem; } .cookie-consent__actions { display: grid; grid-template-columns: 1fr; } .cookie-button { width: 100%; } }
@media (prefers-reduced-motion: reduce) { .cookie-card-enter-active, .cookie-card-leave-active { transition-duration: .01ms; } }
</style>
