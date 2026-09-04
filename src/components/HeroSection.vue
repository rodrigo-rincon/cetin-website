<template>
	<section
		id="home"
		class="relative min-h-[720px] overflow-hidden bg-white transition-colors duration-700 ease-in-out dark:bg-slate-900 lg:min-h-[min(820px,calc(100vh-2rem))]"
	>
		<!-- Fondos optimizados para cada tema -->
		<div class="absolute inset-0">
			<img
				src="../assets/images/hero-cetin-light.png"
				alt=""
				class="absolute inset-0 h-full w-full object-cover object-[68%_center] opacity-100 transition-opacity duration-700 ease-in-out motion-reduce:duration-0 dark:opacity-0 sm:object-center"
				aria-hidden="true"
			/>
			<img
				src="../assets/images/hero-cetin-dark.png"
				alt=""
				class="absolute inset-0 h-full w-full object-cover object-[68%_center] opacity-0 transition-opacity duration-700 ease-in-out motion-reduce:duration-0 dark:opacity-100 sm:object-center"
				aria-hidden="true"
			/>
		</div>
		<div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/5 opacity-100 transition-opacity duration-700 ease-in-out motion-reduce:duration-0 dark:opacity-0 sm:via-white/55 lg:via-white/20"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-[#061a3a]/95 via-[#061a3a]/78 to-transparent opacity-0 transition-opacity duration-700 ease-in-out motion-reduce:duration-0 dark:opacity-100 sm:via-[#061a3a]/50 lg:via-[#061a3a]/15"></div>
		<!-- Mezcla visual con la siguiente sección para evitar un corte rígido -->
		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-b from-transparent via-gray-50/35 to-gray-50 transition-colors duration-700 motion-reduce:duration-0 dark:via-slate-800/35 dark:to-slate-800 sm:h-36"
			aria-hidden="true"
		></div>

		<!-- Yellow decorative elements with parallax -->
		<div
			ref="parallaxElements"
			class="absolute inset-0 hidden will-change-transform"
		>
			<div
				class="absolute top-32 right-1/4 w-5 h-5 bg-yellow-400/30 rounded-full"
			></div>
			<div
				class="absolute top-1/2 left-16 w-4 h-4 bg-yellow-400/40 rounded-full animate-pulse"
			></div>
			<div
				class="absolute bottom-24 right-20 w-6 h-6 bg-yellow-300/30 rounded-full"
			></div>
			<div
				class="absolute top-40 left-1/3 w-3 h-3 bg-yellow-400/50 rounded-full"
			></div>
			<div
				class="absolute bottom-1/3 left-10 w-5 h-5 rotate-45 border-2 border-yellow-400/30"
			></div>
		</div>

		<div
			class="relative z-10 mx-auto flex min-h-[720px] w-full max-w-7xl items-center px-6 pb-28 pt-24 lg:min-h-[min(820px,calc(100vh-2rem))] lg:px-12 lg:pb-36 lg:pt-32"
		>
			<div
				class="w-full"
			>
				<!-- Left Column: Content -->
				<div
					class="hero-content mx-auto flex max-w-xl flex-col gap-6 text-center transition-colors duration-500 ease-in-out sm:mx-0 sm:text-left lg:max-w-[52%]"
				>
					<!-- Badge -->
					<div class="flex justify-center sm:justify-start">
						<span
							class="animate-float inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-2 text-sm font-medium text-pink-600 transition-colors duration-500 dark:border-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
						>
							<span
								class="w-2 h-2 bg-pink-500 rounded-full"
							></span>
							{{ content.hero.badge }}
						</span>
					</div>

					<!-- Main heading -->
					<h1
						class="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0f2a5c] dark:text-white leading-tight transition-colors duration-500"
					>
						{{ content.hero.title }}
						<span class="text-pink-500"> {{ content.hero.titleHighlight }}</span>
					</h1>

					<!-- Subtitle -->
					<p
						class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 transition-colors duration-500"
					>
						{{ content.hero.subtitle }}
					</p>

					<!-- CTA Buttons -->
					<div
						class="mt-2 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start"
					>
						<a
							href="#contact"
							class="group inline-flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/40 active:scale-95"
						>
							<svg
								class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							{{ content.hero.ctaPrimary }}
						</a>
						<a
							href="#services-info"
							class="group inline-flex items-center justify-center bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
						>
							{{ content.hero.ctaSecondary }}
							<svg
								class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					</div>

					<!-- Stats - Subtle Design -->
					<div
						class="mt-6 flex flex-wrap justify-center gap-4 border-t border-slate-300/60 pt-6 transition-colors duration-500 dark:border-white/15 sm:justify-start lg:mt-8 lg:gap-8 lg:pt-8"
					>
						<div class="text-center">
							<p
								class="text-2xl lg:text-3xl font-bold text-[#0f2a5c] dark:text-white"
							>
								{{ content.stats.bebesAtendidos }}
							</p>
							<p
								class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center justify-center gap-1.5"
							>
								<span class="relative flex h-2 w-2">
									<span
										class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"
									></span>
									<span
										class="relative inline-flex rounded-full h-2 w-2 bg-pink-500"
									></span>
								</span>
								{{ content.stats.bebesAtendidosLabel }}
							</p>
						</div>
						<div
							class="w-px h-10 bg-gray-200 dark:bg-slate-700 hidden sm:block"
						></div>
						<div class="text-center">
							<p
								class="text-2xl lg:text-3xl font-bold text-[#0f2a5c] dark:text-white"
							>
								{{ content.stats.tamicesEspecializados }}
							</p>
							<p
								class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center justify-center gap-1.5"
							>
								<span class="relative flex h-2 w-2">
									<span
										class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"
									></span>
									<span
										class="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"
									></span>
								</span>
								{{ content.stats.tamicesEspecializadosLabel }}
							</p>
						</div>
						<div
							class="w-px h-10 bg-gray-200 dark:bg-slate-700 hidden sm:block"
						></div>
						<div class="text-center">
							<p
								class="text-2xl lg:text-3xl font-bold text-[#0f2a5c] dark:text-white"
							>
								{{ content.stats.confiabilidad }}
							</p>
							<p
								class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center justify-center gap-1.5"
							>
								<span class="relative flex h-2 w-2">
									<span
										class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4577d5] opacity-75"
									></span>
									<span
										class="relative inline-flex rounded-full h-2 w-2 bg-[#4577d5]"
									></span>
								</span>
								{{ content.stats.confiabilidadLabel }}
							</p>
						</div>
					</div>
				</div>

				<!-- Right Column: Image -->
				<div class="hidden">
					<div class="relative overflow-hidden shadow-xl hero-blob">
						<img
							src="../assets/images/banner.jpg"
							alt="Bebé recibiendo atención médica en CETIN"
							class="w-full h-[320px] sm:h-[380px] lg:h-[520px] object-cover"
						/>
					</div>

					<!-- Simple floating card -->
					<div
						class="absolute -bottom-4 -left-4 lg:-left-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 border border-gray-100 dark:border-slate-700 hidden sm:flex items-center gap-3"
					>
						<div
							class="w-10 h-10 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center"
						>
							<svg
								class="w-5 h-5 text-pink-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<p
								class="text-sm font-semibold text-[#0f2a5c] dark:text-white"
							>
								Centro certificado
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								Calidad garantizada
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useReadonlyContent } from '../composables/useContent';

const { content } = useReadonlyContent();

// Parallax refs
const parallaxBg = ref<HTMLElement | null>(null);
const parallaxElements = ref<HTMLElement | null>(null);

// Parallax effect
const handleScroll = () => {
	const scrollY = window.scrollY;

	if (parallaxBg.value) {
		parallaxBg.value.style.transform = `translateY(${scrollY * 0.3}px)`;
	}

	if (parallaxElements.value) {
		parallaxElements.value.style.transform = `translateY(${scrollY * 0.15}px)`;
	}
};

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@keyframes float {
	0%,
	100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-6px);
	}
}

.animate-float {
	animation: float 3s ease-in-out infinite;
}

/* Hero animations */
.hero-content {
	animation: slideInLeft 0.8s ease-out forwards;
}

.hero-image {
	animation: slideInRight 0.8s ease-out forwards;
	animation-delay: 0.2s;
	opacity: 0;
}

@keyframes slideInLeft {
	from {
		opacity: 0;
		transform: translateX(-40px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes slideInRight {
	from {
		opacity: 0;
		transform: translateX(40px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

/* Modern blob clip-path */
.hero-blob {
	clip-path: polygon(
		0% 10%,
		10% 0%,
		90% 0%,
		100% 10%,
		100% 85%,
		85% 100%,
		15% 100%,
		0% 85%
	);
	border-radius: 2rem;
}
</style>
