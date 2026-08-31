<template>
	<section
		id="home"
		class="relative bg-white dark:bg-slate-900 overflow-hidden"
	>
		<!-- Parallax background gradient -->
		<div
			ref="parallaxBg"
			class="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 will-change-transform"
		></div>

		<!-- Yellow decorative elements with parallax -->
		<div
			ref="parallaxElements"
			class="absolute inset-0 will-change-transform"
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
			class="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 lg:pt-32 lg:pb-20 relative z-10 w-full"
		>
			<div
				class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
			>
				<!-- Left Column: Content -->
				<div
					class="flex-1 flex flex-col gap-6 text-center lg:text-left hero-content"
				>
					<!-- Badge -->
					<div class="flex justify-center lg:justify-start">
						<span
							class="inline-flex items-center gap-2 bg-pink-50 dark:bg-pink-900/30 border border-pink-100 dark:border-pink-800 rounded-full px-4 py-2 text-sm font-medium text-pink-600 dark:text-pink-400 animate-float"
						>
							<span
								class="w-2 h-2 bg-pink-500 rounded-full"
							></span>
							{{ content.hero.badge }}
						</span>
					</div>

					<!-- Main heading -->
					<h1
						class="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0f2a5c] dark:text-white leading-tight"
					>
						{{ content.hero.title }}
						<span class="text-pink-500"> {{ content.hero.titleHighlight }}</span>
					</h1>

					<!-- Subtitle -->
					<p
						class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0"
					>
						{{ content.hero.subtitle }}
					</p>

					<!-- CTA Buttons -->
					<div
						class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-2"
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
							href="#services"
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
						class="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8 mt-8 pt-8 border-t border-gray-100 dark:border-slate-700"
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
				<div class="flex-1 relative hero-image">
					<div class="relative overflow-hidden shadow-xl hero-blob">
						<img
							src="../assets/images/banner.jpg"
							alt="Bebé recibiendo atención médica en CETIN"
							class="w-full h-[400px] lg:h-[520px] object-cover"
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
