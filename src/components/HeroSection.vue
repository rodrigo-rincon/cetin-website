<template>
	<section
		id="home"
		ref="heroSection"
		class="relative min-h-[720px] overflow-hidden bg-white transition-colors duration-700 ease-in-out dark:bg-slate-900 lg:min-h-[min(820px,calc(100vh-2rem))]"
	>
		<!-- Fondos optimizados para cada tema -->
		<div class="hero-background absolute inset-0">
			<img
				src="../assets/images/hero-cetin-light.png"
				alt=""
				class="hero-background-layer absolute inset-0 h-full w-full object-cover object-[68%_center] opacity-100 transition-opacity duration-700 ease-in-out motion-reduce:duration-0 dark:opacity-0 sm:object-center"
				aria-hidden="true"
			/>
			<img
				src="../assets/images/hero-cetin-dark.png"
				alt=""
				class="hero-background-layer absolute inset-0 h-full w-full object-cover object-[68%_center] opacity-0 transition-opacity duration-700 ease-in-out motion-reduce:duration-0 dark:opacity-100 sm:object-center"
				aria-hidden="true"
			/>
		</div>
		<div class="hero-ambient-orbit" aria-hidden="true">
			<span></span><span></span><span></span>
		</div>
		<div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/5 opacity-100 transition-opacity duration-700 ease-in-out motion-reduce:duration-0 dark:opacity-0 sm:via-white/55 lg:via-white/20"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-[#061a3a]/95 via-[#061a3a]/78 to-transparent opacity-0 transition-opacity duration-700 ease-in-out motion-reduce:duration-0 dark:opacity-100 sm:via-[#061a3a]/50 lg:via-[#061a3a]/15"></div>
		<!-- Mezcla visual con la siguiente sección para evitar un corte rígido -->
		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-b from-transparent via-gray-50/35 to-gray-50 transition-colors duration-700 motion-reduce:duration-0 dark:via-slate-800/35 dark:to-slate-800 sm:h-36"
			aria-hidden="true"
		></div>

		<div
			v-gsap-reveal="{ children: '.gsap-hero-item', stagger: 0.09, y: 18, start: 'top 96%' }"
			class="relative z-10 mx-auto flex min-h-[720px] w-full max-w-7xl items-center px-6 pb-28 pt-24 lg:min-h-[min(820px,calc(100vh-2rem))] lg:px-12 lg:pb-36 lg:pt-32"
		>
			<div
				class="w-full"
			>
				<!-- Left Column: Content -->
				<div
					class="hero-content mx-auto flex max-w-xl flex-col gap-6 text-center transition-colors duration-500 ease-in-out sm:mx-0 sm:text-left lg:max-w-[52%]"
				>
					<!-- Context label -->
					<div class="gsap-hero-item flex justify-center sm:justify-start">
						<span
							class="inline-flex items-center gap-2 text-sm font-medium text-pink-600 transition-colors duration-300 dark:text-pink-300"
						>
							<span
								class="h-px w-8 bg-pink-500"
							></span>
							{{ content.hero.badge }}
						</span>
					</div>

					<!-- Main heading -->
					<h1
						class="gsap-hero-item text-4xl font-semibold leading-[1.08] text-[#0f2a5c] transition-colors duration-300 dark:text-white sm:text-5xl lg:text-6xl"
					>
						{{ content.hero.title }}
						<span class="text-pink-500"> {{ content.hero.titleHighlight }}</span>
					</h1>

					<!-- Subtitle -->
					<p
						class="gsap-hero-item mx-auto max-w-lg text-lg leading-relaxed text-gray-600 transition-colors duration-300 dark:text-gray-300 sm:mx-0 lg:text-xl"
					>
						{{ content.hero.subtitle }}
					</p>

					<!-- CTA Buttons -->
					<div
						class="gsap-hero-item mt-2 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start"
					>
						<button
							type="button"
							@click="openAppointmentForm"
							class="group inline-flex items-center justify-center rounded-lg bg-pink-600 px-7 py-3.5 font-semibold text-white transition-colors duration-150 hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 active:bg-pink-800"
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
						</button>
						<a
							href="#services-info"
							class="group inline-flex items-center justify-center rounded-lg border border-slate-300/80 bg-white/75 px-7 py-3.5 font-semibold text-slate-700 transition-colors duration-150 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:border-white/20 dark:bg-slate-900/50 dark:text-gray-100 dark:hover:bg-slate-800"
						>
							{{ content.hero.ctaSecondary }}
							<svg
								class="w-4 h-4 ml-2"
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
						class="gsap-hero-item mt-6 flex flex-wrap justify-center gap-4 border-t border-slate-300/60 pt-6 transition-colors duration-500 dark:border-white/15 sm:justify-start lg:mt-8 lg:gap-8 lg:pt-8"
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
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReadonlyContent } from '../composables/useContent';

gsap.registerPlugin(ScrollTrigger);

const { content } = useReadonlyContent();
const heroSection = ref<HTMLElement | null>(null);
let heroContext: gsap.Context | null = null;

const openAppointmentForm = () => {
	window.dispatchEvent(new CustomEvent('open-cetin-appointment'));
};

onMounted(() => {
	const hero = heroSection.value;
	if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	heroContext = gsap.context(() => {
		gsap.to('.hero-background-layer', {
			scale: 1.065,
			yPercent: 4,
			ease: 'none',
			scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.15 },
		});

		gsap.to('.hero-content', {
			opacity: 0.76,
			y: 42,
			ease: 'none',
			scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 25%', scrub: 1.1 },
		});

		const orbit = gsap.to('.hero-ambient-orbit', {
			rotation: 360,
			duration: 26,
			ease: 'none',
			repeat: -1,
			paused: true,
		});

		ScrollTrigger.create({
			trigger: hero,
			start: 'top bottom',
			end: 'bottom top',
			onEnter: () => orbit.play(),
			onEnterBack: () => orbit.play(),
			onLeave: () => orbit.pause(),
			onLeaveBack: () => orbit.pause(),
		});
	}, hero);
});

onBeforeUnmount(() => {
	heroContext?.revert();
	heroContext = null;
});

</script>

<style scoped>
/* Hero animations */
.hero-content {
	animation: heroEnter 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hero-background {
	overflow: hidden;
}

.hero-background-layer {
	will-change: transform;
}

.hero-ambient-orbit {
	position: absolute;
	right: 24%;
	bottom: 16%;
	z-index: 4;
	width: clamp(8rem, 13vw, 12rem);
	aspect-ratio: 1;
	border: 1px solid rgb(96 165 250 / .22);
	border-radius: 50%;
	pointer-events: none;
	transform-origin: center;
}

.hero-ambient-orbit::before {
	position: absolute;
	inset: 18%;
	border: 1px dashed rgb(236 72 153 / .2);
	border-radius: 50%;
	content: '';
}

.hero-ambient-orbit span {
	position: absolute;
	width: .55rem;
	height: .55rem;
	border-radius: 50%;
	background: #ec4899;
	box-shadow: 0 0 0 5px rgb(236 72 153 / .1);
}

.hero-ambient-orbit span:nth-child(1) { left: 12%; top: 12%; }
.hero-ambient-orbit span:nth-child(2) { right: -2%; top: 48%; background: #60a5fa; box-shadow: 0 0 0 5px rgb(96 165 250 / .1); }
.hero-ambient-orbit span:nth-child(3) { bottom: 4%; left: 28%; width: .4rem; height: .4rem; background: #f59e0b; box-shadow: 0 0 0 5px rgb(245 158 11 / .1); }

@media (max-width: 767px) {
	.hero-ambient-orbit {
		display: none;
	}
}

.hero-image {
	animation: slideInRight 0.8s ease-out forwards;
	animation-delay: 0.2s;
	opacity: 0;
}

@keyframes heroEnter {
	from {
		opacity: 0;
		transform: translateY(8px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
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
