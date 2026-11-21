<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { legalConfig } from '../config/legal';

type LegalDocument = 'privacy' | 'terms' | 'cookies';
const route = useRoute();
const documentType = computed<LegalDocument>(() => (route.meta.legalDocument as LegalDocument) || 'privacy');
const title = computed(() => ({
	privacy: 'Aviso de privacidad integral',
	terms: 'Términos y condiciones de uso',
	cookies: 'Política de cookies y tecnologías',
}[documentType.value]));
</script>

<template>
	<div class="min-h-screen bg-slate-50 text-slate-700 transition-colors dark:bg-slate-900 dark:text-slate-300">
		<header class="border-b border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95">
			<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
				<router-link to="/" class="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500">
					<img src="../assets/images/cetin_logo.png" alt="CETIN" class="h-11 w-11 object-contain" />
					<span class="font-heading text-lg font-extrabold text-[#0f2a5c] dark:text-white">CETIN</span>
				</router-link>
				<router-link to="/" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-[#0f2a5c] transition hover:border-pink-300 hover:text-pink-600 dark:border-slate-700 dark:text-white dark:hover:border-pink-500">Volver al inicio</router-link>
			</div>
		</header>

		<main class="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
			<div class="mb-9">
				<p class="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-pink-600 dark:text-pink-400">Información legal</p>
				<h1 class="text-3xl font-extrabold tracking-tight text-[#0f2a5c] dark:text-white sm:text-4xl">{{ title }}</h1>
				<p class="mt-3 text-sm text-slate-500 dark:text-slate-400">Última actualización: {{ legalConfig.lastUpdated }}</p>
			</div>

			<div v-if="!legalConfig.isIdentityConfirmed" class="mb-8 rounded-2xl border border-yellow-300 bg-yellow-50 p-5 text-sm leading-6 text-slate-800 dark:border-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-100" role="note">
				<strong>Borrador pendiente de validación.</strong> Antes de publicarlo se debe confirmar la razón social o nombre de la persona responsable y su domicilio legal. El contenido también debe ser revisado por asesoría jurídica.
			</div>

			<article v-if="documentType === 'privacy'" class="legal-document">
				<p><strong>{{ legalConfig.responsibleName }}</strong>, con domicilio en <strong>{{ legalConfig.legalAddress }}</strong>, es responsable del tratamiento de los datos personales que recaba por medio de este sitio web, WhatsApp, teléfono, correo electrónico y durante la prestación de sus servicios.</p>

				<h2>1. Datos personales que tratamos</h2>
				<p>Podemos recabar datos de identificación y contacto, como nombre, teléfono y correo electrónico; datos de la persona paciente y de su madre, padre, tutor o representante; datos de agenda, sucursal y servicio solicitado; y, cuando sea necesario para prestar el servicio, información clínica y resultados de tamizaje.</p>
				<p>Los datos relacionados con el estado de salud presente o futuro, antecedentes, estudios y resultados son <strong>datos personales sensibles</strong>. Su tratamiento se limitará a lo necesario y se realizará con el consentimiento expreso que corresponda, salvo las excepciones previstas por la legislación aplicable.</p>

				<h2>2. Finalidades primarias</h2>
				<ul>
					<li>Atender solicitudes de información y coordinar pre-citas o citas.</li>
					<li>Identificar a la persona paciente y a su madre, padre, tutor o representante.</li>
					<li>Prestar servicios de tamizaje, integrar el expediente correspondiente y entregar resultados.</li>
					<li>Dar seguimiento al servicio, responder dudas y atender aclaraciones.</li>
					<li>Cumplir obligaciones sanitarias, contractuales, fiscales y de seguridad aplicables.</li>
					<li>Mantener controles de calidad, seguridad y trazabilidad de la atención.</li>
				</ul>

				<h2>3. Finalidades secundarias</h2>
				<p>Solo con autorización separada podremos enviar encuestas de satisfacción, novedades, campañas preventivas o promociones. Negarse a estas finalidades no afecta la atención ni los servicios solicitados. Puede retirar dicha autorización escribiendo a <a :href="`mailto:${legalConfig.privacyEmail}`">{{ legalConfig.privacyEmail }}</a>.</p>

				<h2>4. Transferencias y encargados</h2>
				<p>Podremos comunicar datos a profesionales de la salud, laboratorios o prestadores que intervengan en el servicio; autoridades competentes cuando exista obligación legal; y proveedores tecnológicos que procesen información por cuenta de CETIN bajo instrucciones y medidas de confidencialidad. Cuando una transferencia requiera consentimiento, este se solicitará previamente.</p>
				<p>Al elegir continuar por WhatsApp, la información escrita se envía mediante un servicio operado por Meta y queda sujeta también a sus condiciones y políticas. Recomendamos no incluir información clínica adicional en el mensaje inicial.</p>

				<h2>5. Derechos ARCO y revocación</h2>
				<p>La persona titular o su representante puede solicitar acceso, rectificación, cancelación u oposición (derechos ARCO), revocar su consentimiento o limitar el uso y divulgación de sus datos. Envíe la solicitud a <a :href="`mailto:${legalConfig.privacyEmail}`">{{ legalConfig.privacyEmail }}</a> con:</p>
				<ul>
					<li>Nombre y medio para comunicar la respuesta.</li>
					<li>Documentos que acrediten identidad y, en su caso, representación.</li>
					<li>Descripción clara de los datos y del derecho que desea ejercer.</li>
					<li>Información que facilite localizar los datos; para rectificación, la corrección solicitada y su soporte.</li>
				</ul>
				<p>La solicitud se atenderá dentro de los plazos previstos por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. La revocación no tendrá efectos retroactivos y puede estar limitada por obligaciones legales de conservación.</p>

				<h2>6. Conservación y seguridad</h2>
				<p>Conservaremos los datos solo durante el tiempo necesario para las finalidades descritas y los plazos legales aplicables. Mantenemos medidas administrativas, técnicas y físicas razonables para evitar daño, pérdida, alteración, destrucción, uso o acceso no autorizado.</p>

				<h2>7. Menores de edad</h2>
				<p>Los servicios de CETIN se relacionan principalmente con niñas y niños. Los datos deberán ser proporcionados por su madre, padre, tutor o representante legal. No solicitamos que una persona menor de edad nos envíe directamente información por este sitio.</p>

				<h2>8. Tecnologías y servicios de terceros</h2>
				<p>El sitio utiliza almacenamiento local para recordar el tema visual y, en áreas administrativas, mantener la sesión y respaldar contenido. También puede cargar mapas de OpenStreetMap/MapLibre y videos de YouTube; estos proveedores pueden recibir información técnica como dirección IP y datos del navegador. Consulte nuestra <router-link to="/politica-de-cookies">Política de cookies y tecnologías</router-link>.</p>

				<h2>9. Cambios al aviso</h2>
				<p>Las modificaciones se publicarán en esta misma página indicando la fecha de actualización. Si el cambio requiere un nuevo consentimiento, se solicitará por un medio adecuado antes de aplicar el nuevo tratamiento.</p>

				<h2>10. Contacto</h2>
				<p>Para dudas sobre privacidad: <a :href="`mailto:${legalConfig.privacyEmail}`">{{ legalConfig.privacyEmail }}</a> · {{ legalConfig.contactPhone }}.</p>
			</article>

			<article v-else-if="documentType === 'terms'" class="legal-document">
				<p>Estos términos regulan el acceso y uso del sitio de <strong>{{ legalConfig.responsibleName }}</strong>. Al navegar por el sitio acepta estas condiciones. Si no está de acuerdo, debe abstenerse de utilizarlo.</p>

				<h2>1. Finalidad del sitio</h2>
				<p>El sitio proporciona información general sobre CETIN, sus sucursales y servicios, y facilita el contacto para solicitar una pre-cita. La solicitud enviada por WhatsApp no constituye una cita confirmada; esta queda sujeta a disponibilidad y confirmación del personal.</p>

				<h2>2. Información médica</h2>
				<p>El contenido es informativo y no sustituye una consulta, diagnóstico, indicación o tratamiento médico. Los resultados deben ser interpretados por personal de salud competente. Ante una urgencia, contacte inmediatamente a los servicios de emergencia; este sitio y el chat no son canales de urgencias.</p>

				<h2>3. Uso permitido</h2>
				<p>La persona usuaria se compromete a proporcionar información veraz, utilizar el sitio de forma lícita y no intentar vulnerar su seguridad, suplantar identidades, interferir con su funcionamiento, extraer datos de forma automatizada ni usar el contenido con fines fraudulentos.</p>

				<h2>4. Servicios, precios y disponibilidad</h2>
				<p>La información, horarios, disponibilidad y características de los servicios pueden cambiar. Los precios, indicaciones, alcances y condiciones definitivas serán los comunicados y aceptados al contratar el servicio. Las imágenes son ilustrativas.</p>

				<h2>5. Propiedad intelectual</h2>
				<p>Las marcas, logotipos, textos, fotografías, diseños, videos y demás contenidos pertenecen a CETIN o se utilizan con autorización. No se concede licencia para reproducirlos, modificarlos o explotarlos, salvo autorización previa por escrito o los usos permitidos por la ley.</p>

				<h2>6. Enlaces y plataformas externas</h2>
				<p>El sitio puede enlazar a WhatsApp, redes sociales, YouTube, Google Maps u otros servicios independientes. CETIN no controla sus plataformas, disponibilidad ni políticas. El uso de esos servicios se rige también por las condiciones del tercero.</p>

				<h2>7. Disponibilidad y responsabilidad</h2>
				<p>Procuramos que la información sea clara y que el sitio esté disponible, pero no garantizamos funcionamiento ininterrumpido o ausencia absoluta de errores. Nada en estos términos limita responsabilidades que legalmente no puedan excluirse ni los derechos de las personas consumidoras.</p>

				<h2>8. Privacidad</h2>
				<p>El tratamiento de datos personales se describe en el <router-link to="/aviso-de-privacidad">Aviso de privacidad integral</router-link> y la <router-link to="/politica-de-cookies">Política de cookies y tecnologías</router-link>.</p>

				<h2>9. Modificaciones y contacto</h2>
				<p>Podemos actualizar estos términos y publicaremos aquí la nueva fecha de vigencia. Para dudas, escriba a <a :href="`mailto:${legalConfig.privacyEmail}`">{{ legalConfig.privacyEmail }}</a> o llame al {{ legalConfig.contactPhone }}.</p>
			</article>

			<article v-else class="legal-document">
				<p>Esta política explica las tecnologías utilizadas por el sitio de CETIN. Actualmente el sitio público no utiliza cookies publicitarias ni herramientas propias de analítica de comportamiento.</p>

				<h2>1. Almacenamiento necesario y de preferencias</h2>
				<p>El navegador utiliza almacenamiento local para recordar si eligió el modo claro u oscuro. El gestor administrativo usa almacenamiento local para mantener la sesión autorizada y respaldar temporalmente contenido. Estas funciones son necesarias o solicitadas por la persona usuaria y no se utilizan para publicidad.</p>

				<h2>2. Contenido de terceros</h2>
				<ul>
					<li><strong>YouTube:</strong> el reproductor se carga cuando la persona decide reproducir un video. YouTube puede colocar o leer identificadores y recibir datos técnicos.</li>
					<li><strong>OpenStreetMap y MapLibre:</strong> al visualizar el mapa se solicitan mosaicos cartográficos, lo que puede comunicar la dirección IP y datos técnicos al proveedor.</li>
					<li><strong>WhatsApp y redes sociales:</strong> solo se abren al activar el enlace correspondiente y quedan sujetos a las políticas de cada plataforma.</li>
				</ul>

				<h2>3. Cómo controlar estas tecnologías</h2>
				<p>Puede borrar el almacenamiento del sitio desde la configuración de su navegador, bloquear contenido de terceros o navegar con protecciones adicionales. Si elimina el almacenamiento local, se restablecerán preferencias como el tema visual y se cerrará cualquier sesión administrativa.</p>

				<h2>4. Cambios futuros</h2>
				<p>Si incorporamos analítica, publicidad u otras tecnologías no esenciales, actualizaremos esta política y, cuando corresponda, solicitaremos consentimiento antes de activarlas.</p>

				<h2>5. Contacto</h2>
				<p>Para preguntas sobre estas tecnologías, escriba a <a :href="`mailto:${legalConfig.privacyEmail}`">{{ legalConfig.privacyEmail }}</a>.</p>
			</article>
		</main>
	</div>
</template>

<style scoped>
.legal-document { display: grid; gap: 1rem; font-size: 1rem; line-height: 1.8; }
.legal-document h2 { margin-top: 1.5rem; color: #0f2a5c; font-size: 1.35rem; font-weight: 800; letter-spacing: -.015em; }
.legal-document ul { display: grid; gap: .55rem; padding-left: 1.4rem; list-style: disc; }
.legal-document a { color: #db2777; font-weight: 650; text-decoration: underline; text-decoration-color: rgb(219 39 119 / .35); text-underline-offset: 3px; }
:global(.dark .legal-document h2) { color: white; }
:global(.dark .legal-document a) { color: #f9a8d4; }
</style>
