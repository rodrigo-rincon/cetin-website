<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useReadonlyContent } from '../composables/useContent';

const { content } = useReadonlyContent();
const isOpen = ref(false);
const submitted = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | undefined;
const clearCloseTimer = () => { clearTimeout(closeTimer); closeTimer = undefined; };
const form = reactive({
	tutor: '',
	patient: '',
	branchId: '',
	service: '',
	privacyConsent: false,
});

const services = computed(() => [
	...content.value.infoSection.services.map((service) => service.name),
	'Paquete de tamices',
	'Otro servicio',
]);
const selectedBranch = computed(() =>
	content.value.sucursales.find((branch) => branch.id === form.branchId),
);
const isValid = computed(() => Boolean(form.tutor.trim() && selectedBranch.value && form.service && form.privacyConsent));

const open = () => { clearCloseTimer(); submitted.value = false; isOpen.value = true; };
const close = () => { clearCloseTimer(); isOpen.value = false; };
const handleEscape = (event: KeyboardEvent) => {
	if (event.key === 'Escape') close();
};

watch(isOpen, (value) => {
	document.body.style.overflow = value ? 'hidden' : '';
});

onMounted(() => {
	window.addEventListener('open-cetin-appointment', open);
	window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
	clearCloseTimer();
	window.removeEventListener('open-cetin-appointment', open);
	window.removeEventListener('keydown', handleEscape);
	document.body.style.overflow = '';
});

const sendToWhatsApp = () => {
	if (submitted.value || !isValid.value || !selectedBranch.value) return;

	const message = [
		'Hola, deseo solicitar una pre-cita en CETIN.',
		`Nombre de contacto: ${form.tutor.trim()}`,
		form.patient.trim() ? `Paciente: ${form.patient.trim()}` : '',
		`Sucursal: ${selectedBranch.value.name}`,
		`Servicio: ${form.service}`,
		'¿Me ayudan a coordinar la fecha y el horario disponibles?',
	].filter(Boolean).join('\n');

	const configuredNumber = content.value.contact.whatsapp.replace(/\D/g, '');
	const whatsappNumber = configuredNumber.length === 10 ? `52${configuredNumber}` : configuredNumber;
	window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
	submitted.value = true;
	Object.assign(form, { tutor: '', patient: '', branchId: '', service: '', privacyConsent: false });
	closeTimer = setTimeout(close, 8000);
};
</script>

<template>
	<Teleport to="body">
		<Transition name="appointment-drawer">
			<div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" @click.self="close">
				<section class="clay-card appointment-panel relative w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="public-appointment-title">
					<button type="button" class="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Cerrar pre-cita" @click="close">✕</button>
					<template v-if="!submitted">
						<h2 id="public-appointment-title" class="pr-8 text-xl font-bold text-[#0f2a5c] dark:text-white">Solicita tu pre-cita</h2>
						<p class="mb-5 mt-1 text-sm text-slate-600 dark:text-slate-300">Coordinamos contigo por WhatsApp.</p>
						<form class="flex flex-col gap-3" @submit.prevent="sendToWhatsApp">
							<label class="field-label">Tu nombre<input v-model.trim="form.tutor" required maxlength="100" class="field-control" type="text" autocomplete="name" placeholder="Nombre de contacto" /></label>
							<label class="field-label">Paciente (opcional)<input v-model.trim="form.patient" maxlength="100" class="field-control" type="text" placeholder="Nombre del paciente" /></label>
							<label class="field-label">Sucursal<select v-model="form.branchId" required class="field-control"><option value="" disabled>Selecciona una sucursal</option><option v-for="branch in content.sucursales" :key="branch.id" :value="branch.id">{{ branch.name }} · {{ branch.city }}</option></select></label>
							<label class="field-label">Servicio<select v-model="form.service" required class="field-control"><option value="" disabled>Selecciona un servicio</option><option v-for="service in services" :key="service" :value="service">{{ service }}</option></select></label>
							<div class="rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs leading-5 text-slate-600 dark:border-blue-800/60 dark:bg-blue-900/30 dark:text-slate-300">
								<p><strong class="text-[#0f2a5c] dark:text-blue-200">Aviso de privacidad simplificado:</strong> CETIN usará tu nombre, los datos opcionales del paciente, la sucursal y el servicio para atender tu solicitud y coordinar la pre-cita por WhatsApp. El servicio elegido puede revelar información relacionada con la salud.</p>
								<router-link to="/aviso-de-privacidad" target="_blank" class="mt-1 inline-flex font-bold text-pink-600 underline underline-offset-2 dark:text-pink-300">Consultar aviso integral</router-link>
							</div>
							<label class="consent-field">
								<input v-model="form.privacyConsent" required type="checkbox" class="mt-0.5 h-4 w-4 flex-none accent-pink-600" />
								<span>Confirmo que soy mayor de edad y, en su caso, madre, padre, tutor o representante del paciente. Consiento expresamente el tratamiento y envío por WhatsApp de estos datos para gestionar la pre-cita.</span>
							</label>
							<button type="submit" :disabled="!isValid" class="clay-action w-full rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-slate-950 hover:bg-[#20bd5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-45">Continuar en WhatsApp</button>
						</form>
					</template>
					<div v-else role="status" aria-live="polite" class="py-8 text-center">
						<div aria-hidden="true" class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700 dark:bg-green-900/40 dark:text-green-300">✓</div>
						<h2 id="public-appointment-title" class="text-xl font-bold text-[#0f2a5c] dark:text-white">Continúa en WhatsApp</h2>
						<p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Tu mensaje está listo. Pulsa Enviar en WhatsApp para que el equipo de CETIN pueda concretar tu cita.</p>
						<p class="mt-4 text-xs text-slate-500 dark:text-slate-400">Este aviso se cerrará en 8 segundos.</p>
					</div>
				</section>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.appointment-panel { max-height: calc(100dvh - 2rem); }
.field-label { display: flex; flex-direction: column; gap: .25rem; color: rgb(71 85 105); font-size: .8125rem; font-weight: 600; }
.field-control { width: 100%; min-width: 0; border: 1px solid rgb(203 213 225); border-radius: .5rem; background: white; padding: .625rem .75rem; color: rgb(51 65 85); font-size: 1rem; font-weight: 400; outline: none; }
.field-control:focus { border-color: rgb(236 72 153); box-shadow: 0 0 0 3px rgb(236 72 153 / .12); }
.consent-field { display: flex; align-items: flex-start; gap: .6rem; color: rgb(71 85 105); font-size: .75rem; line-height: 1.25rem; cursor: pointer; }
.appointment-drawer-enter-active, .appointment-drawer-leave-active { transition: opacity .2s ease; }
.appointment-drawer-enter-from, .appointment-drawer-leave-to { opacity: 0; }
:global(.dark) .field-label { color: rgb(203 213 225); }
:global(.dark) .consent-field { color: rgb(203 213 225); }
:global(.dark) .field-control { border-color: rgb(71 85 105); background: rgb(30 41 59); color: rgb(241 245 249); color-scheme: dark; }
:global(.dark) .field-control::placeholder { color: rgb(148 163 184); }
:global(.dark) .field-control:focus { border-color: rgb(244 114 182); box-shadow: 0 0 0 3px rgb(244 114 182 / .18); }
:global(.dark) .field-control option { background: rgb(30 41 59); color: rgb(241 245 249); }
</style>
