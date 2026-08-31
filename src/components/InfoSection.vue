<template>
	<section
		id="services-info"
		class="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden"
	>
		<!-- Decorative elements with secondary colors -->
		<div
			class="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-cetin-lavender/30 dark:border-cetin-lavender/20 opacity-50"
		></div>
		<div
			class="absolute bottom-20 -left-10 w-48 h-48 rounded-full border border-cetin-turquoise/30 dark:border-cetin-turquoise/20 opacity-40"
		></div>
		<!-- Colorful decorative dots -->
		<div
			class="absolute top-32 left-1/4 w-5 h-5 bg-cetin-gold/30 rounded-full"
		></div>
		<div
			class="absolute bottom-40 left-20 w-6 h-6 bg-cetin-lime/30 rounded-full"
		></div>
		<div
			class="absolute top-1/2 right-1/4 w-3 h-3 bg-cetin-coral/40 rounded-full"
		></div>
		<div
			class="absolute bottom-24 right-10 w-5 h-5 rotate-45 border-2 border-cetin-turquoise/30"
		></div>
		<div
			class="absolute top-40 right-1/3 w-4 h-4 bg-cetin-lavender/25 rounded-full"
		></div>
		<div
			class="absolute bottom-1/3 left-10 w-3 h-3 bg-cetin-coral/20 rounded-full animate-pulse"
		></div>

		<div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
			<!-- Section header with Dr. Blue -->
			<div v-fade-up class="mb-20">
				<!-- Header badge centered -->
				<div class="text-center mb-6">
					<span
						class="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 uppercase tracking-wider"
					>
						<span class="w-8 h-[2px] bg-pink-500"></span>
						{{ content.infoSection.badge }}
						<span class="w-8 h-[2px] bg-pink-500"></span>
					</span>
				</div>

				<!-- Main content with Dr. Blue on left -->
				<div
					class="flex flex-col lg:flex-row lg:items-center lg:gap-10"
				>
					<!-- Dr. Blue pointing right -->
					<div
						class="flex flex-col items-center flex-shrink-0 order-1 lg:order-none mb-6 lg:mb-0"
					>
						<img
							src="../assets/images/dr-blue/dr-cetin-02.png"
							alt="Dr. CETIN presentando los servicios"
							class="w-32 lg:w-52 h-auto object-contain drop-shadow-lg"
						/>
					</div>

					<!-- Text content -->
					<div class="flex-1 text-center lg:text-left">
						<h2
							class="text-3xl lg:text-5xl font-bold text-[#0f2a5c] dark:text-white leading-tight mb-6"
						>
							{{ content.infoSection.title }}
							<span class="text-pink-500"> {{ content.infoSection.titleHighlight }}</span>
						</h2>
						<p
							class="text-base lg:text-lg text-gray-500 dark:text-gray-400 leading-relaxed lg:text-justify max-w-3xl"
						>
							{{ content.infoSection.description }}
						</p>
					</div>
				</div>
			</div>

			<!-- Bento Grid Services -->
			<div
				v-scale-up
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
			>
				<!-- Service 1 - Metabólico (Featured - Large) -->
				<div
					class="lg:col-span-2 group relative bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-8 lg:p-10 overflow-hidden"
				>
					<!-- Background pattern -->
					<div class="absolute inset-0 opacity-10">
						<div
							class="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"
						></div>
						<div
							class="absolute bottom-10 right-1/4 w-20 h-20 border border-white rounded-full"
						></div>
					</div>

					<div
						class="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6"
					>
						<div class="flex-1">
							<div
								class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
							>
								<img
									src="../assets/images/card-icons/Meta.png"
									alt="Icono Metabólico"
									class="w-5 h-5 object-contain"
								/>
<span class="text-white text-sm font-medium"
									>Más solicitado</span
								>
							</div>
							<h3
								class="text-2xl lg:text-3xl font-bold text-pink-50 mb-3"
							>
								Tamiz Metabólico
							</h3>
							<p
								class="text-white/90 leading-relaxed text-lg max-w-lg"
							>
								Te ayudamos a detectar de forma preventiva las
								enfermedades endocrino-metabólicas.
							</p>
						</div>
						<div
							class="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl flex items-center justify-center flex-shrink-0"
						>
							<img
								src="../assets/images/card-icons/Meta.png"
								alt="Icono Tamiz Metabólico"
								class="w-20 h-20 lg:w-28 lg:h-28 object-contain"
							/>
						</div>
					</div>
				</div>

				<!-- Service 2 - Cardiológico -->
				<div
					class="group relative bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-pink-200 dark:border-red-500/50 hover:border-cetin-coral dark:hover:border-cetin-coral hover:shadow-2xl hover:shadow-pink-100/50 dark:hover:shadow-pink-900/30 transition-all duration-500"
				>
					<div
						class="absolute top-6 right-6 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
					>
						<img
							src="../assets/images/card-icons/Cardio.png"
							alt="Icono Cardiológico"
							class="w-12 h-12 object-contain"
						/>
					</div>
					<div class="pt-8">
						<span
							class="text-xs font-bold text-pink-500 dark:text-pink-400 uppercase tracking-wider"
							>Corazón</span
						>
						<h3
							class="text-xl font-bold text-[#0f2a5c] dark:text-white mt-2 mb-3"
						>
							Tamiz Cardiológico
						</h3>
						<p
							class="text-gray-600 dark:text-gray-400 leading-relaxed"
						>
							Revisamos la oximetría del pulso para la evaluación
							y detección de riesgos de padecer enfermedades
							cardíacas congénitas.
						</p>
					</div>
				</div>

				<!-- Service 3 - Auditivo -->
				<div
					class="group relative bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-yellow-200 dark:border-yellow-900/50 hover:border-yellow-400 dark:hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-100/50 dark:hover:shadow-yellow-900/30 transition-all duration-500"
				>
					<div
						class="absolute top-6 right-6 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
					>
						<img
							src="../assets/images/card-icons/Auditivo.png"
							alt="Icono Auditivo"
							class="w-12 h-12 object-contain"
						/>
					</div>
					<div class="pt-8">
						<span
							class="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider"
							>Audición</span
						>
						<h3
							class="text-xl font-bold text-[#0f2a5c] dark:text-white mt-2 mb-3"
						>
							Tamiz Auditivo
						</h3>
						<p
							class="text-gray-600 dark:text-gray-400 leading-relaxed"
						>
							Detección de uno de los principales problemas en la
							población infantil: La hipoacusia o comúnmente
							llamado sordera.
						</p>
					</div>
				</div>

				<!-- Service 4 - Visual -->
				<div
					class="group relative bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-blue-200 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-cetin-turquoise hover:shadow-2xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/30 transition-all duration-500"
				>
					<div
						class="absolute top-6 right-6 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
					>
						<img
							src="../assets/images/card-icons/Visual.png"
							alt="Icono Visual"
							class="w-12 h-12 object-contain"
						/>
					</div>
					<div class="pt-8">
						<span
							class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider"
							>Vista</span
						>
						<h3
							class="text-xl font-bold text-[#0f2a5c] dark:text-white mt-2 mb-3"
						>
							Tamiz Visual
						</h3>
						<p
							class="text-gray-600 dark:text-gray-400 leading-relaxed"
						>
							Evaluamos el desarrollo adecuado de la visión de
							acuerdo a la edad. Estudio no invasivo ni doloroso
							para tu bebé.
						</p>
					</div>
				</div>

				<!-- Service 5 - Cadera -->
				<div
					class="group relative bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400 dark:hover:border-cetin-lime hover:shadow-2xl hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/30 transition-all duration-500"
				>
					<div
						class="absolute top-6 right-6 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
					>
						<img
							src="../assets/images/card-icons/Cadera.png"
							alt="Icono Cadera"
							class="w-12 h-12 object-contain"
						/>
					</div>
					<div class="pt-8">
						<span
							class="text-xs font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider"
							>Cadera</span
						>
						<h3
							class="text-xl font-bold text-[#0f2a5c] dark:text-white mt-2 mb-3"
						>
							Tamiz Cadera
						</h3>
						<p
							class="text-gray-600 dark:text-gray-400 leading-relaxed"
						>
							Ecografía de cadera, utilizamos ondas sonoras para
							generar imágenes de la cadera y posteriormente su
							evaluación.
						</p>
					</div>
				</div>

				<!-- CTA Card - Paquetes -->
				<div
					class="lg:col-span-3 group relative bg-[#0f2a5c] rounded-3xl p-8 lg:p-10 overflow-hidden"
				>
					<!-- Background pattern -->
					<div class="absolute inset-0 opacity-10">
						<div
							class="absolute -top-10 -left-10 w-40 h-40 border-2 border-white rounded-full"
						></div>
						<div
							class="absolute bottom-0 right-1/3 w-24 h-24 border border-white rounded-full"
						></div>
						<div
							class="absolute top-1/2 right-10 w-16 h-16 border border-white rounded-full"
						></div>
					</div>

					<div
						class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
					>
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-4">
								<div
									class="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center"
								>
									<svg
										class="w-6 h-6 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<span
									class="text-pink-400 text-sm font-semibold uppercase tracking-wider"
									>Ahorra con nuestros paquetes</span
								>
							</div>
							<h3
								class="text-2xl lg:text-3xl font-bold text-white mb-3"
							>
								Paquetes Especiales para tu Bebé
							</h3>
							<p
								class="text-gray-300 leading-relaxed text-lg max-w-2xl"
							>
								Descuentos especiales al combinar varios
								tamices. Cuida la salud de tu recién nacido
								desde el primer día con atención integral.
							</p>
						</div>
						<a
							href="#contact"
							class="group inline-flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 gap-2 flex-shrink-0 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/40 active:scale-95"
						>
							Ver Paquetes
							<svg
								class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { vFadeUp, vScaleUp } from '../directives/scrollReveal';
import { useReadonlyContent } from '../composables/useContent';

const { content } = useReadonlyContent();
</script>
