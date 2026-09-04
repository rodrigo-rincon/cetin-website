<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Carousel from '../components/carousel.vue';
import HeroSection from '../components/HeroSection.vue';
import InfoSection from '../components/InfoSection.vue';
import { useReadonlyContent } from '../composables/useContent';
import type { Sucursal } from '../data/content';
import defaultSucursalCover from '../assets/images/cetin_ciudad_de_mexico.jpg';
import {
	vFadeUp,
	vSlideLeft,
	vSlideRight,
	vScaleUp,
} from '../directives/scrollReveal';

const { content } = useReadonlyContent();

const activeVideoIds = ref<Set<string>>(new Set());

const getYouTubeId = (url: string) => {
	const match = url.match(/(?:embed\/|youtu\.be\/|watch\?v=)([\w-]{11})/);
	return match?.[1] || '';
};

const getVideoThumbnail = (url: string) => {
	const id = getYouTubeId(url);
	return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
};

const activateVideo = (id: string) => {
	activeVideoIds.value = new Set(activeVideoIds.value).add(id);
};

const getSucursal = (id: string) =>
	content.value.sucursales.find((sucursal) => sucursal.id === id);

const getSucursalCover = (id: string) =>
	getSucursal(id)?.image || defaultSucursalCover;

const getBranchLayoutClass = (index: number, total: number) => {
	const classes = ['md:col-span-3', 'lg:col-start-auto'];

	if (total % 2 === 1 && index === total - 1) {
		classes.push('md:col-span-4', 'md:col-start-2');
	}

	if (total === 1) {
		classes.push('lg:col-span-6');
	} else if (total === 2 || total === 4) {
		classes.push('lg:col-span-3');
	} else if (total === 5) {
		classes.push(index < 2 ? 'lg:col-span-3' : 'lg:col-span-2');
	} else {
		const remainder = total % 3;
		const balancedTailSize = remainder === 1 ? 4 : remainder;
		classes.push(index >= total - balancedTailSize ? 'lg:col-span-3' : 'lg:col-span-2');
	}

	return classes;
};

const selectedMapBranch = ref<Sucursal | null>(null);
const mapReady = ref(false);
const mapError = ref(false);
const mapMarkerElements = new Map<string, HTMLElement>();

watch(selectedMapBranch, (selectedBranch) => {
	mapMarkerElements.forEach((element, id) => {
		const isActive = id === selectedBranch?.id;
		element.classList.toggle('is-active', isActive);
		element.setAttribute('aria-pressed', String(isActive));
	});
});

// Parallax refs
const parallaxSucursal = ref<HTMLElement | null>(null);

// Parallax scroll handler
const handleParallax = () => {
	if (parallaxSucursal.value) {
		const rect = parallaxSucursal.value.getBoundingClientRect();
		const scrolled = window.innerHeight - rect.top;
		if (scrolled > 0 && rect.bottom > 0) {
			const parallaxValue = scrolled * 0.3;
			const img = parallaxSucursal.value.querySelector(
				'.parallax-img',
			) as HTMLElement;
			if (img) {
				img.style.transform = `translateY(${-parallaxValue}px) scale(1.2)`;
			}
		}
	}
};

onMounted(() => {
	window.addEventListener('scroll', handleParallax, { passive: true });
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleParallax);
});

let mapInstance: MapLibreMap | null = null;

// Inicializar mapa de sucursales
const initMap = async () => {
	mapReady.value = false;
	mapError.value = false;
	mapInstance?.remove();
	const maplibregl = await import('maplibre-gl');
	const places = content.value.sucursales.filter(
		(branch) => Number.isFinite(branch.latitude) && Number.isFinite(branch.longitude),
	);

	const elementoMapa = document.getElementById('cetin-map');
	if (!elementoMapa) {
		console.warn('Map container not found');
		return;
	}
	elementoMapa.replaceChildren();

	// Calcular límites del mapa
	const limites = new maplibregl.LngLatBounds();
	places.forEach(({ longitude, latitude }) => limites.extend([longitude, latitude]));

	// Crear mapa con MapLibre - Estilo verde natural con labels en español
	mapInstance = new maplibregl.Map({
		container: 'cetin-map',
		style: {
			version: 8,
			sources: {
				osm: {
					type: 'raster',
					tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
					tileSize: 256,
					attribution: '© OpenStreetMap contributors',
				},
			},
			layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
		},
		bounds: limites,
		fitBoundsOptions: { padding: 60, maxZoom: 12 },
		scrollZoom: false,
	});
	const mapa = mapInstance;

	// Agregar controles de navegación
	mapa.addControl(new maplibregl.NavigationControl(), 'top-right');

	// Agregar marcadores cuando el mapa esté listo
	mapa.on('load', () => {
		mapReady.value = true;
		places.forEach((sucursal) => {
			const { latitude, longitude } = sucursal;
			// Crear elemento del marcador personalizado
			const el = document.createElement('div');
			el.className = 'marcador-cetin';
			el.innerHTML = `
				<div style="
					background: linear-gradient(135deg, #E91E8C 0%, #d4177d 100%);
					width: 36px;
					height: 36px;
					border-radius: 50% 50% 50% 0;
					transform: rotate(-45deg);
					border: 3px solid white;
					box-shadow: 0 4px 12px rgba(233, 30, 140, 0.4);
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
				">
					<svg style="transform: rotate(45deg); width: 16px; height: 16px;" fill="white" viewBox="0 0 24 24">
						<path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
					</svg>
				</div>
			`;
			el.setAttribute('role', 'button');
			el.setAttribute('aria-label', `Ver información de ${sucursal.name}`);
			el.setAttribute('aria-pressed', 'false');
			el.tabIndex = 0;
			mapMarkerElements.set(sucursal.id, el);
			const openBranchPanel = (event: Event) => {
				event.stopPropagation();
				selectedMapBranch.value = sucursal;
			};
			el.addEventListener('click', openBranchPanel);
			el.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' || event.key === ' ') openBranchPanel(event);
			});

			// Agregar marcador al mapa
			new maplibregl.Marker({ element: el })
				.setLngLat([longitude, latitude])
				.addTo(mapa);
		});
	});
	mapa.on('error', () => {
		if (!mapReady.value) mapError.value = true;
	});
	mapa.on('click', () => {
		selectedMapBranch.value = null;
	});
};

onMounted(() => {
	void initMap();
});

onUnmounted(() => {
	mapInstance?.remove();
	mapInstance = null;
	mapMarkerElements.clear();
});
</script>

<template>
	<div class="main flex flex-col w-full relative bg-white dark:bg-slate-900">
		<HeroSection class="order-1" />

		<!-- Copy Section -->
		<section
			class="order-4 py-14 lg:py-16 bg-white dark:bg-slate-900 relative overflow-hidden"
		>
			<!-- Decorative elements with secondary colors -->
			<div
				class="absolute -top-10 -left-10 w-40 h-40 rounded-full border-2 border-cetin-lavender/40 dark:border-cetin-lavender/20 opacity-50"
			></div>
			<div
				class="absolute top-1/2 -right-16 w-32 h-32 rounded-full border border-cetin-turquoise/40 dark:border-cetin-turquoise/20 opacity-40"
			></div>
			<!-- Colorful decorative elements -->
			<div
				class="absolute top-20 right-1/4 w-6 h-6 bg-cetin-gold/30 rounded-full"
			></div>
			<div
				class="absolute bottom-32 left-20 w-4 h-4 bg-cetin-lime/35 rounded-full"
			></div>
			<div
				class="absolute top-1/3 left-1/4 w-3 h-3 bg-cetin-coral/40 rounded-full animate-pulse"
			></div>

			<div
				v-fade-up
				class="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10"
			>
				<h2
					class="text-3xl lg:text-4xl font-bold text-[#0f2a5c] dark:text-white leading-tight mb-4"
				>
					{{ content.videosSection.title }}
				</h2>
				<p
					class="text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
				>
					{{ content.videosSection.subtitle }}
				</p>
			</div>

			<!-- Videos Section -->
			<div
				v-fade-up="{ delay: 200 }"
				class="mx-auto mt-10 w-full px-6 lg:mt-12 lg:px-8 xl:px-12"
			>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<!-- Dynamic Videos -->
					<div v-for="video in content.videosSection.videos" :key="video.id" class="group">
						<div
							class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
						>
							<!-- Video: el reproductor se carga solo cuando el usuario lo solicita -->
							<div class="relative aspect-video overflow-hidden bg-slate-950">
								<iframe
									v-if="activeVideoIds.has(video.id)"
									class="w-full h-full"
									:src="`${video.youtubeUrl}${video.youtubeUrl.includes('?') ? '&' : '?'}autoplay=1`"
									:title="video.title"
									loading="lazy"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
									allowfullscreen
								></iframe>
								<button
									v-else
									type="button"
									class="group/play absolute inset-0 flex w-full items-center justify-center overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-pink-400"
									:aria-label="`Reproducir ${video.title}`"
									@click="activateVideo(video.id)"
								>
									<img v-if="getVideoThumbnail(video.youtubeUrl)" :src="getVideoThumbnail(video.youtubeUrl)" alt="" loading="lazy" class="h-full w-full object-cover opacity-80 transition duration-500 group-hover/play:scale-105 group-hover/play:opacity-65" />
									<span class="absolute flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-white shadow-xl transition duration-300 group-hover/play:scale-110 group-hover/play:bg-pink-600" aria-hidden="true">
										<svg class="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
									</span>
								</button>
							</div>
							<!-- Caption -->
							<div
								class="bg-[#0f2a5c] px-4 py-3.5"
							>
								<div class="hidden">
									<div
										class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center ring-2 ring-[#0f2a5c]"
									>
										<svg
											class="w-4 h-4 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
									<div
										class="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center ring-2 ring-[#0f2a5c]"
									>
										<svg
											class="w-4 h-4 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
											/>
										</svg>
									</div>
									<div
										class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center ring-2 ring-[#0f2a5c]"
									>
										<svg
											class="w-4 h-4 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
								</div>
								<h3 class="mb-1 text-sm font-bold text-white">{{ video.title }}</h3>
								<p class="text-xs leading-relaxed text-slate-300">
									{{ video.description }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- US Section - Why Choose Us (Nosotros) -->
		<section
			id="us"
			class="order-2 relative overflow-hidden bg-gray-50 py-16 transition-colors duration-500 dark:bg-slate-800 lg:py-24"
		>
			<!-- Decorative shapes -->
			<div
				class="absolute -right-20 top-20 w-40 h-40 border border-pink-200 dark:border-pink-800 rounded-full opacity-40"
			></div>
			<div
				class="absolute -right-10 top-40 w-24 h-24 border border-blue-200 dark:border-blue-800 rounded-full opacity-30"
			></div>
			<div
				class="absolute left-10 bottom-20 w-16 h-16 border-2 border-yellow-400 dark:border-yellow-600 rounded-full opacity-40"
			></div>
			<!-- Yellow accent elements -->
			<div
				class="absolute top-10 left-1/3 w-8 h-8 bg-yellow-400/20 rounded-full"
			></div>
			<div
				class="absolute bottom-40 right-1/4 w-5 h-5 bg-yellow-400/30 rounded-full"
			></div>
			<div
				class="absolute top-1/2 left-20 w-3 h-3 bg-yellow-300/40 rounded-full animate-pulse"
			></div>
			<!-- Yellow star shape -->
			<div
				class="absolute bottom-10 right-10 w-6 h-6 rotate-45 border-2 border-yellow-400/40 dark:border-yellow-600/40"
			></div>

			<div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
				<div class="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
					<!-- Left: Features -->
					<div v-slide-right class="space-y-7 lg:col-span-7">
						<div>
							<span
								class="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4"
							>
								<span
									class="w-8 h-[2px] bg-blue-600 dark:bg-blue-400"
								></span>
								¿Por qué elegirnos?
							</span>
							<h2
								class="text-3xl lg:text-4xl font-bold text-[#0f2a5c] dark:text-white leading-tight"
							>
								Lo que nos hace
								<span class="text-blue-600 dark:text-blue-400"
									>diferentes</span
								>
							</h2>
						</div>

						<!-- Feature items -->
						<div class="grid gap-4 xl:grid-cols-2">
							<div
								class="group flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-pink-800"
							>
								<div
									class="w-14 h-14 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center flex-shrink-0"
								>
									<svg
										class="w-7 h-7 text-pink-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
										/>
									</svg>
								</div>
								<div>
									<h3
										class="text-lg font-bold text-[#0f2a5c] dark:text-white mb-1"
									>
										Años de experiencia
									</h3>
									<p class="text-gray-600 dark:text-gray-400">
										Personal altamente capacitado con amplia
										trayectoria en tamizaje neonatal.
									</p>
								</div>
							</div>

							<div
								class="group flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-800"
							>
								<div
									class="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0"
								>
									<svg
										class="w-7 h-7 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<div>
									<h3
										class="text-lg font-bold text-[#0f2a5c] dark:text-white mb-1"
									>
										Equipos de alta tecnología
									</h3>
									<p class="text-gray-600 dark:text-gray-400">
										Contamos con equipos nuevos, calibrados
										según normas internacionales.
									</p>
								</div>
							</div>

							<div
								class="group flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-yellow-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-yellow-800"
							>
								<div
									class="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl flex items-center justify-center flex-shrink-0"
								>
									<svg
										class="w-7 h-7 text-yellow-600 dark:text-yellow-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<div>
									<h3
										class="text-lg font-bold text-[#0f2a5c] dark:text-white mb-1"
									>
										Proceso rápido y eficiente
									</h3>
									<p class="text-gray-600 dark:text-gray-400">
										Resultados confiables en el menor tiempo
										posible.
									</p>
								</div>
							</div>

							<div
								class="group flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-red-800"
							>
								<div
									class="w-14 h-14 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center flex-shrink-0"
								>
									<svg
										class="w-7 h-7 text-red-500 dark:text-red-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
								<div>
									<h3
										class="text-lg font-bold text-[#0f2a5c] dark:text-white mb-1"
									>
										Staff profesional
									</h3>
									<p class="text-gray-600 dark:text-gray-400">
										Médicos subespecialistas expertos que
										avalan todos nuestros resultados.
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Right: Stats Card -->
					<div v-slide-left class="relative lg:col-span-5 lg:pt-11">
						<div
							class="relative flex h-full flex-col overflow-hidden rounded-3xl border border-blue-100 bg-white p-7 shadow-xl shadow-blue-950/5 transition-colors duration-500 dark:border-slate-700 dark:bg-slate-900 sm:p-9"
						>
							<div class="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-100/60 blur-2xl dark:bg-blue-900/20"></div>
							<span class="relative mb-4 text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Nuestro respaldo</span>
							<h3
								class="relative mb-4 text-2xl font-bold leading-tight text-[#0f2a5c] transition-colors duration-500 dark:text-white lg:text-[1.75rem]"
							>
								Tecnología avanzada para detectar enfermedades
								con precisión
							</h3>
							<p
								class="relative mb-8 text-base leading-relaxed text-gray-600 transition-colors duration-500 dark:text-gray-400"
							>
								En CETIN utilizamos los equipos más modernos del
								mercado para garantizar resultados confiables.
							</p>

							<!-- Stats -->
							<div class="relative grid grid-cols-2 gap-3 sm:gap-4">
								<div
									class="text-center p-5 bg-pink-50 dark:bg-pink-900/30 rounded-2xl"
								>
									<p
										class="text-3xl lg:text-4xl font-bold text-pink-500 mb-2"
									>
										{{ content.stats.tamicesEspecializados }}
									</p>
									<p
										class="text-gray-600 dark:text-gray-400 font-medium text-sm"
									>
										{{ content.stats.tamicesEspecializadosLabel }}
									</p>
								</div>
								<div
									class="text-center p-5 bg-blue-50 dark:bg-blue-900/30 rounded-2xl"
								>
									<p
										class="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"
									>
										{{ content.stats.confiabilidad }}
									</p>
									<p
										class="text-gray-600 dark:text-gray-400 font-medium text-sm"
									>
										{{ content.stats.confiabilidadLabel }}
									</p>
								</div>
							</div>

							<a
								href="#services-info"
								class="group relative mt-auto inline-flex w-full items-center justify-center rounded-xl bg-pink-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:bg-pink-600 hover:shadow-xl hover:shadow-pink-500/30 active:scale-[0.98]"
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
								Conocer nuestros tamices
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Servicios -->
		<InfoSection class="order-3" />

		<!-- Labor Altruista Section -->
		<section v-if="content.laborAltruista.active" class="order-9 py-16 lg:py-24 bg-[#0f2a5c] relative overflow-hidden">
			<!-- Decorative patterns -->
			<div class="absolute inset-0 opacity-10">
				<div
					class="absolute top-20 left-10 w-32 h-32 border-2 border-white rounded-full"
				></div>
				<div
					class="absolute top-40 right-20 w-24 h-24 border-2 border-white rounded-full"
				></div>
				<div
					class="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"
				></div>
				<div
					class="absolute bottom-40 right-1/3 w-40 h-40 border-2 border-pink-300 rounded-full"
				></div>
			</div>
			<!-- Yellow accent elements -->
			<div
				class="absolute top-16 right-1/4 w-4 h-4 bg-yellow-400/60 rounded-full"
			></div>
			<div
				class="absolute bottom-24 left-1/3 w-6 h-6 bg-yellow-400/40 rounded-full animate-pulse"
			></div>
			<div
				class="absolute top-1/2 right-10 w-3 h-3 bg-yellow-300/50 rounded-full"
			></div>
			<div
				class="absolute bottom-1/3 left-16 w-5 h-5 rotate-45 border-2 border-yellow-400/30"
			></div>

			<div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
				<div
					class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
				>
					<!-- Left: Content -->
					<div v-slide-right class="text-center lg:text-left">
						<!-- Badge -->
						<div
							class="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20 mb-8"
						>
							<span class="relative flex h-3 w-3">
								<span
									class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"
								></span>
								<span
									class="relative inline-flex rounded-full h-3 w-3 bg-pink-500"
								></span>
							</span>
							<span
								class="text-sm font-semibold text-white uppercase tracking-wider"
								>{{ content.laborAltruista.badge }}</span
							>
						</div>

						<!-- Main heading -->
						<h2
							class="text-3xl lg:text-4xl font-bold text-blue-50 leading-tight mb-6"
						>
							{{ content.laborAltruista.title }}
							<span class="text-pink-400">{{ content.laborAltruista.titleHighlight }}</span>
						</h2>

						<!-- Description -->
						<div
							class="space-y-5 text-lg text-blue-100 leading-relaxed"
						>
							<p>{{ content.laborAltruista.description1 }}</p>
							<p>{{ content.laborAltruista.description2 }}</p>
						</div>
					</div>

					<!-- Right: Video Container -->
					<div v-scale-up class="relative">
						<!-- Glow effect -->
						<div
							class="absolute -inset-4 bg-gradient-to-r from-pink-500 to-pink-400 rounded-[2rem] opacity-20 blur-xl"
						></div>

						<div
							class="relative bg-white rounded-3xl p-6 lg:p-8 overflow-hidden"
						>
							<!-- Video wrapper with aspect ratio -->
							<div
								class="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-lg"
							>
								<iframe
									loading="lazy"
									class="w-full h-full"
									:src="content.laborAltruista.videoUrl"
									title="Labor Altruista CETIN"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
									allowfullscreen
								></iframe>
							</div>

							<!-- Quote caption -->
							<div class="flex items-center gap-4 mt-5 px-2">
								<div class="flex -space-x-3 shrink-0">
									<div
										class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center ring-4 ring-white"
									>
										<svg
											class="w-5 h-5 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
									<div
										class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center ring-4 ring-white"
									>
										<svg
											class="w-5 h-5 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
											/>
										</svg>
									</div>
									<div
										class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center ring-4 ring-white"
									>
										<svg
											class="w-5 h-5 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
								</div>
								<p
									class="text-[#0f2a5c] font-medium leading-snug"
								>
									"{{ content.laborAltruista.videoCaption }}"
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- How to Book Section -->
		<section
			id="services"
			class="order-5 py-16 lg:py-24 bg-gradient-to-b from-pink-500 via-pink-500 to-pink-600 relative overflow-hidden"
		>
			<!-- Subtle floating shapes with secondary colors -->
			<div
				class="absolute top-20 left-10 w-32 h-32 bg-cetin-lavender/40 rounded-full blur-2xl"
			></div>
			<div
				class="absolute bottom-20 right-10 w-40 h-40 bg-cetin-turquoise/35 rounded-full blur-2xl"
			></div>
			<div
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/20 rounded-full blur-3xl"
			></div>
			<!-- Decorative dots pattern -->
			<div class="absolute top-16 right-20 opacity-60">
				<div class="flex gap-2">
					<div class="w-2 h-2 rounded-full bg-cetin-gold"></div>
					<div class="w-2 h-2 rounded-full bg-cetin-gold"></div>
					<div class="w-2 h-2 rounded-full bg-cetin-gold"></div>
				</div>
				<div class="flex gap-2 mt-2">
					<div class="w-2 h-2 rounded-full bg-cetin-gold"></div>
					<div class="w-2 h-2 rounded-full bg-cetin-gold"></div>
					<div class="w-2 h-2 rounded-full bg-cetin-gold"></div>
				</div>
			</div>
			<div class="absolute bottom-16 left-20 opacity-60">
				<div class="flex gap-2">
					<div class="w-2 h-2 rounded-full bg-cetin-lime"></div>
					<div class="w-2 h-2 rounded-full bg-cetin-lime"></div>
					<div class="w-2 h-2 rounded-full bg-cetin-lime"></div>
				</div>
				<div class="flex gap-2 mt-2">
					<div class="w-2 h-2 rounded-full bg-cetin-lime"></div>
					<div class="w-2 h-2 rounded-full bg-cetin-lime"></div>
					<div class="w-2 h-2 rounded-full bg-cetin-lime"></div>
				</div>
			</div>
			<!-- Floating rings -->
			<div class="absolute top-32 right-1/4 w-16 h-16 border-2 border-cetin-turquoise/40 rounded-full"></div>
			<div class="absolute bottom-32 left-1/4 w-24 h-24 border-2 border-cetin-lavender/40 rounded-full"></div>
			<!-- Small accent shapes -->
			<div class="absolute top-1/3 left-8 w-3 h-3 bg-cetin-coral/70 rounded-full"></div>
			<div class="absolute top-2/3 right-12 w-4 h-4 bg-cetin-gold/60 rotate-45"></div>

			<div class="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
				<!-- Header -->
				<div class="text-center mb-16">
					<h2 class="text-3xl lg:text-4xl font-bold text-slate-100 mb-3">
						¿Cómo agendar una cita?
					</h2>
					<p class="text-slate-300 text-lg">
						Solo sigue estos simples pasos
					</p>
				</div>

				<!-- Steps - Clean minimal cards -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-5">
					<!-- Step 1 -->
					<div
						class="group bg-[#0f2a5c] rounded-2xl p-7 shadow-lg shadow-pink-600/20 hover:shadow-xl hover:shadow-pink-600/30 hover:-translate-y-1 transition-all duration-300"
					>
						<div class="flex items-center gap-3 mb-5">
							<span
								class="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-[#0f2a5c] font-bold text-sm"
								>1</span
							>
							<div class="h-px flex-1 bg-white/20"></div>
						</div>
						<div
							class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors"
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
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-white mb-2">
							Ubica tu CETIN
						</h3>
						<p class="text-white/70 text-sm leading-relaxed">
							Encuentra la sucursal más cercana a tu domicilio.
						</p>
					</div>

					<!-- Step 2 -->
					<div
						class="group bg-[#0f2a5c] rounded-2xl p-7 shadow-lg shadow-pink-600/20 hover:shadow-xl hover:shadow-pink-600/30 hover:-translate-y-1 transition-all duration-300"
					>
						<div class="flex items-center gap-3 mb-5">
							<span
								class="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-[#0f2a5c] font-bold text-sm"
								>2</span
							>
							<div class="h-px flex-1 bg-white/20"></div>
						</div>
						<div
							class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors"
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
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-white mb-2">
							Elige fecha y hora
						</h3>
						<p class="text-white/70 text-sm leading-relaxed">
							Llámanos y agenda la fecha que mejor te convenga.
						</p>
					</div>

					<!-- Step 3 -->
					<div
						class="group bg-[#0f2a5c] rounded-2xl p-7 shadow-lg shadow-pink-600/20 hover:shadow-xl hover:shadow-pink-600/30 hover:-translate-y-1 transition-all duration-300"
					>
						<div class="flex items-center gap-3 mb-5">
							<span
								class="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-[#0f2a5c] font-bold text-sm"
								>3</span
							>
							<div class="h-px flex-1 bg-white/20"></div>
						</div>
						<div
							class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors"
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
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-white mb-2">
							Acude a tu cita
						</h3>
						<p class="text-white/70 text-sm leading-relaxed">
							Visítanos en el lugar y hora acordada. ¡Te
							esperamos!
						</p>
					</div>
				</div>

				<!-- CTA -->
				<div class="mt-12 text-center">
					<a
						href="#contact"
						class="group inline-flex items-center gap-3 bg-[#0f2a5c] hover:bg-[#1a3d6e] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#0f2a5c]/25 hover:scale-105"
					>
						Agendar mi cita
						<svg
							class="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
		</section>

		<!-- Respaldo médico -->
		<section class="order-3 relative overflow-hidden bg-[#0f2a5c] py-14 lg:py-16">
			<div class="absolute inset-y-0 left-0 w-1.5 bg-pink-500"></div>
			<div class="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10"></div>
			<div class="absolute -bottom-24 right-24 h-48 w-48 rounded-full border border-pink-400/15"></div>
			<div v-fade-up class="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center md:flex-row md:text-left lg:px-12">
				<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-pink-300 ring-1 ring-white/15 backdrop-blur-sm">
					<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12.75l2 2 4-5m5.25 2.25c0 4.97-3.69 8.62-8.25 9.75C7.44 20.62 3.75 16.97 3.75 12V5.85L12 2.25l8.25 3.6V12z" />
					</svg>
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-xs font-semibold uppercase tracking-[0.2em] text-pink-300">Respaldo médico especializado</p>
					<h2 class="mt-2 text-2xl font-semibold leading-snug text-white lg:text-3xl">
						Todos los resultados son revisados e interpretados por médicos subespecialistas expertos en cada área.
					</h2>
				</div>
				<div class="hidden h-16 w-px bg-white/15 md:block"></div>
				<p class="max-w-48 text-sm leading-6 text-blue-100/75">Precisión, experiencia y acompañamiento para cada familia.</p>
			</div>
		</section>

		<!-- Nueva Sucursal Section -->
		<section v-if="content.proximamente.active" ref="parallaxSucursal" class="order-8 py-20 lg:py-32 relative overflow-hidden">
			<!-- Background Image with Parallax -->
			<div class="absolute inset-0 overflow-hidden">
				<img
					:src="content.proximamente.backgroundImage || defaultSucursalCover"
					alt="Nueva sucursal CETIN"
					class="parallax-img w-full h-[140%] object-cover will-change-transform"
					style="transform: translateY(0) scale(1.2)"
				/>
				<!-- Overlay gradient -->
				<div
					class="absolute inset-0 bg-gradient-to-b from-[#0f2a5c]/70 via-[#0f2a5c]/60 to-[#0f2a5c]/70 dark:from-[#0f2a5c]/80 dark:via-[#0f2a5c]/70 dark:to-[#0f2a5c]/80"
				></div>
			</div>

			<!-- Decorative elements with secondary colors -->
			<div
				class="absolute -top-10 right-20 w-48 h-48 rounded-full border-2 border-cetin-coral/30 dark:border-cetin-coral/20 opacity-50"
			></div>
			<div
				class="absolute bottom-20 -left-10 w-36 h-36 rounded-full border border-cetin-turquoise/30 dark:border-cetin-turquoise/20 opacity-40"
			></div>
			<div
				class="absolute top-1/3 left-10 w-5 h-5 rounded-full border border-cetin-gold/50 dark:border-cetin-gold/30 opacity-60"
			></div>

			<div
				v-scale-up
				class="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10"
			>
				<!-- Badge -->
				<div
					class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
				>
					<span class="relative flex h-2 w-2">
						<span
							class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"
						></span>
						<span
							class="relative inline-flex rounded-full h-2 w-2 bg-pink-400"
						></span>
					</span>
					<span
						class="text-sm font-semibold text-white uppercase tracking-wider"
						>{{ content.proximamente.badge }}</span
					>
				</div>

				<h2
					class="text-3xl md:text-4xl font-bold text-slate-100 leading-tight mb-4"
				>
					{{ content.proximamente.title }}
					<span class="text-pink-400">{{ content.proximamente.titleHighlight }}</span>
				</h2>
				<p class="text-xl lg:text-2xl text-slate-300">
					{{ content.proximamente.subtitle }}
				</p>
			</div>
		</section>

		<!-- Testimonials Section -->
		<section
			id="clients"
			class="order-6 py-16 lg:py-20 bg-white dark:bg-slate-900 relative overflow-hidden"
		>
			<!-- Decorative shapes -->
			<div
				class="absolute top-10 right-20 w-32 h-32 border border-pink-200 dark:border-pink-800 rounded-full opacity-30"
			></div>
			<div
				class="absolute bottom-20 left-10 w-20 h-20 border border-pink-200 dark:border-pink-800 rounded-full opacity-25"
			></div>
			<!-- Cross pattern -->
			<div class="absolute top-1/2 right-10 w-8 h-8 opacity-20">
				<div
					class="absolute top-1/2 left-0 w-full h-[2px] bg-pink-300 dark:bg-pink-700 -translate-y-1/2"
				></div>
				<div
					class="absolute left-1/2 top-0 h-full w-[2px] bg-pink-300 dark:bg-pink-700 -translate-x-1/2"
				></div>
			</div>
			<!-- Yellow accent elements -->
			<div
				class="absolute top-24 left-1/4 w-5 h-5 bg-yellow-400/30 rounded-full"
			></div>
			<div
				class="absolute bottom-32 right-1/3 w-4 h-4 bg-yellow-400/40 rounded-full animate-pulse"
			></div>
			<div
				class="absolute top-1/3 left-16 w-6 h-6 rotate-45 border-2 border-yellow-400/30"
			></div>

			<div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
				<div v-fade-up class="text-center mb-10 lg:mb-12">
					<span
						class="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 uppercase tracking-wider mb-4"
					>
						<span class="w-8 h-[2px] bg-pink-500"></span>
						Testimonios
						<span class="w-8 h-[2px] bg-pink-500"></span>
					</span>
					<h2
						class="text-3xl lg:text-4xl font-bold text-[#0f2a5c] dark:text-white leading-tight"
					>
						Lo que dicen nuestros
						<span class="text-pink-500">clientes</span>
					</h2>
					<p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Experiencias compartidas por familias que visitaron nuestras sucursales
					</p>
				</div>
				<div v-fade-up="{ delay: 200 }">
					<Carousel />
				</div>
			</div>
		</section>

		<!-- Contact Section -->
		<section
			id="contact"
			class="order-7 py-16 lg:py-20 bg-gray-50 dark:bg-slate-800 relative overflow-hidden"
		>
			<!-- Decorative shapes -->
			<div
				class="absolute -left-16 top-1/3 w-32 h-32 border border-pink-200 dark:border-pink-800 rounded-full opacity-30"
			></div>
			<div
				class="absolute right-20 bottom-20 w-24 h-24 border border-blue-200 dark:border-blue-800 rounded-full opacity-25"
			></div>
			<!-- Diamond shape -->
			<div
				class="absolute top-20 right-1/4 w-6 h-6 border-2 border-yellow-400 dark:border-yellow-600 rotate-45 opacity-40"
			></div>
			<!-- Yellow accent elements -->
			<div
				class="absolute bottom-1/4 left-1/4 w-4 h-4 bg-yellow-400/30 rounded-full"
			></div>
			<div
				class="absolute top-1/4 right-10 w-5 h-5 bg-yellow-400/40 rounded-full animate-pulse"
			></div>
			<div
				class="absolute bottom-40 right-1/3 w-3 h-3 bg-yellow-300/50 rounded-full"
			></div>

			<!-- Dr. Blue waving -->
			<div
				class="flex justify-center lg:absolute lg:left-0 lg:-bottom-4 pointer-events-none z-20 mb-2 lg:mb-0"
			>
				<div class="relative">
					<img
						src="../assets/images/dr-blue/dr-cetin-01.png"
						alt="Dr. CETIN te saluda"
						class="w-40 lg:w-80 h-auto object-contain drop-shadow-xl"
					/>
					<!-- Speech bubble -->
					<div class="absolute right-0 lg:right-0 top-6 lg:top-12 bg-pink-500 rounded-2xl px-3 lg:px-5 py-2 lg:py-3 shadow-lg max-w-[120px] lg:max-w-[160px]">
						<p class="text-xs lg:text-sm font-semibold text-white leading-tight">¡Estamos para ayudarte!</p>
						<!-- Bubble arrow pointing left -->
						<div class="absolute left-[-8px] lg:left-[-10px] top-4 lg:top-5 w-0 h-0 border-t-[8px] lg:border-t-[10px] border-t-transparent border-b-[8px] lg:border-b-[10px] border-b-transparent border-r-[8px] lg:border-r-[10px] border-r-pink-500"></div>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
				<!-- Section Header -->
				<div v-fade-up class="text-center mb-8 lg:mb-12">
					<span
						class="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 uppercase tracking-wider mb-4"
					>
						<span class="w-8 h-[2px] bg-pink-500"></span>
						Contacto
						<span class="w-8 h-[2px] bg-pink-500"></span>
					</span>
					<h2
						class="text-3xl lg:text-4xl font-bold text-[#0f2a5c] dark:text-white leading-tight mb-4"
					>
						¿Listo para agendar tu cita?
					</h2>
					<p
						class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
					>
						Contáctanos por cualquiera de nuestros medios. Estamos
						aquí para ayudarte.
					</p>
				</div>

				<!-- Corporativo + Email Hero Section -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
					<!-- Corporativo Card - Principal -->
					<div
						class="group relative p-6 lg:p-8 bg-gradient-to-br from-[#0f2a5c] via-[#143366] to-[#1a3a6c] rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
					>
						<!-- Decorative elements -->
						<div
							class="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl"
						></div>
						<div
							class="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"
						></div>

						<div class="relative z-10">
							<div class="flex items-center gap-4 mb-6">
								<div
									class="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
								>
									<svg
										class="w-8 h-8 text-[#0f2a5c]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
								</div>
								<div>
									<span
										class="text-yellow-400/80 text-sm font-medium uppercase tracking-wider"
										>Contacto Principal</span
									>
									<h3 class="font-bold text-white text-2xl">
										Corporativo
									</h3>
								</div>
							</div>

							<div class="flex flex-col sm:flex-row gap-4">
								<a
									href="tel:+522223994072"
									class="flex-1 inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40"
								>
									<svg
										class="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
									222 399 4072
								</a>
								<a
									href="https://wa.me/522223994072?text=%C2%A1Hola!%20Me%20gustar%C3%ADa%20agendar%20una%20cita."
									target="_blank"
									class="flex-1 inline-flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-[#0f2a5c] font-bold px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-400/25"
								>
									<svg
										class="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
										/>
									</svg>
									WhatsApp
								</a>
							</div>
						</div>
					</div>

					<!-- Email Card -->
					<a
						href="mailto:cetincorporativo@gmail.com"
					class="group relative p-6 lg:p-8 bg-gradient-to-br from-pink-500 via-pink-500 to-pink-600 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
					>
						<!-- Decorative elements -->
						<div
							class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
						></div>
						<div
							class="absolute bottom-0 left-0 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl"
						></div>

						<div
							class="relative z-10 h-full flex flex-col justify-between"
						>
							<div class="flex items-center gap-4 mb-6">
								<div
									class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
								>
									<svg
										class="w-8 h-8 text-pink-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<div>
									<span
										class="text-slate-300 text-sm font-medium uppercase tracking-wider"
										>Escríbenos</span
									>
									<h3 class="font-bold text-slate-100 text-2xl">
										Correo
									</h3>
								</div>
							</div>

							<div
								class="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20 group-hover:bg-white/20 transition-all"
							>
								<p
									class="text-white font-semibold text-lg break-all"
								>
									cetincorporativo@gmail.com
								</p>
							</div>
						</div>
					</a>
				</div>

				<!-- Sucursales Section Title -->
				<div class="flex items-center gap-4 mb-6">
					<div
						class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent"
					></div>
					<h2 class="text-2xl font-bold text-[#0f2a5c] dark:text-white">Nuestras Sucursales</h2>
					<div
						class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent"
					></div>
				</div>

				<!-- Sucursales Grid -->
				<div class="branch-layout grid grid-cols-1 items-stretch gap-6 md:grid-cols-6 lg:gap-7 mb-12">
					<article
						v-for="(sucursal, index) in content.sucursales"
						:key="sucursal.id"
						class="branch-card group flex h-full flex-col overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
						:class="getBranchLayoutClass(index, content.sucursales.length)"
					>
						<img
							:src="getSucursalCover(sucursal.id)"
							:alt="`Portada de ${sucursal.name}`"
							class="branch-card-image transition-transform duration-700 group-hover:scale-105"
						/>
						<div class="branch-card-content flex flex-1 items-end gap-4 p-6">
							<div>
								<h3 class="font-bold text-[#0f2a5c] dark:text-white mb-1">
									{{ sucursal.name }}
								</h3>
								<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
									{{ sucursal.address }}
								</p>
								<a
									v-if="sucursal.phone"
									:href="`tel:${sucursal.phone.replace(/\s/g, '')}`"
									class="inline-flex items-center text-sm font-semibold text-[#0f2a5c] dark:text-pink-300"
								>
									{{ sucursal.phone }}
								</a>
								<div class="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-700">
									<a
										v-if="sucursal.email"
										:href="`mailto:${sucursal.email}`"
										class="block truncate text-sm text-slate-600 hover:text-pink-500 dark:text-slate-300 dark:hover:text-pink-300"
									>
										{{ sucursal.email }}
									</a>
									<a
										v-if="sucursal.facebook"
										:href="sucursal.facebook"
										target="_blank"
										rel="noopener noreferrer"
										class="block text-sm font-medium text-slate-600 hover:text-pink-500 dark:text-slate-300 dark:hover:text-pink-300"
									>
										Facebook
									</a>
								</div>
								<a
									v-if="sucursal.mapsUrl"
									:href="sucursal.mapsUrl"
									target="_blank"
									rel="noopener noreferrer"
									class="mt-5 flex items-center justify-between rounded-xl bg-[#0f2a5c] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-pink-500 hover:shadow-md"
								>
									Ver ubicación <span aria-hidden="true">→</span>
								</a>
							</div>
						</div>
					</article>
				</div>

				<!-- Map with all locations -->
				<div class="relative">
					<div
						class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden"
						style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.1);"
					>
						<div id="cetin-map" style="width:100%;height:360px;min-height:320px;display:flex;align-items:center;justify-content:center;background:#f1f5f9;">
							<p style="color:#64748b;font-size:14px;">Cargando mapa...</p>
						</div>
						<div v-if="mapError && !mapReady" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100/95 px-6 text-center dark:bg-slate-900/95">
							<p class="font-semibold text-[#0f2a5c] dark:text-white">No pudimos cargar el mapa</p>
							<p class="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">Puedes abrir la ubicación desde cualquiera de las tarjetas o volver a intentarlo.</p>
							<button type="button" class="mt-4 rounded-xl bg-[#0f2a5c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-500" @click="initMap">Volver a intentar</button>
						</div>
						<Transition name="map-panel">
							<aside
								v-if="selectedMapBranch"
								class="absolute inset-y-0 right-0 z-20 flex w-[min(340px,calc(100%-1rem))] flex-col bg-white/95 p-6 shadow-2xl backdrop-blur-md dark:bg-slate-900/95"
								aria-live="polite"
							>
								<Transition name="branch-detail" mode="out-in">
									<div :key="selectedMapBranch.id" class="flex h-full flex-col">
								<div class="flex items-start justify-between gap-4">
									<div>
										<p class="text-xs font-semibold uppercase tracking-[0.16em] text-pink-500">Sucursal</p>
										<h3 class="mt-1 text-2xl font-bold text-[#0f2a5c] dark:text-white">{{ selectedMapBranch.name }}</h3>
									</div>
									<button type="button" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-300" aria-label="Cerrar información de sucursal" @click="selectedMapBranch = null">×</button>
								</div>

								<p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ selectedMapBranch.address }}</p>

								<div class="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-slate-700">
									<a :href="`tel:${selectedMapBranch.phone.replace(/\s/g, '')}`" class="block text-sm font-semibold text-[#0f2a5c] transition hover:text-pink-500 dark:text-white">{{ selectedMapBranch.phone }}</a>
									<a :href="`mailto:${getSucursal(selectedMapBranch.id)?.email || content.contact.email}`" class="block truncate text-sm text-slate-600 transition hover:text-pink-500 dark:text-slate-300">{{ getSucursal(selectedMapBranch.id)?.email || content.contact.email }}</a>
									<a :href="getSucursal(selectedMapBranch.id)?.facebook || content.footer.socialLinks.facebook" target="_blank" rel="noopener noreferrer" class="block text-sm text-slate-600 transition hover:text-pink-500 dark:text-slate-300">Facebook</a>
								</div>

								<a :href="selectedMapBranch.mapsUrl" target="_blank" rel="noopener noreferrer" class="mt-auto flex items-center justify-between rounded-xl bg-[#0f2a5c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-500">
									Abrir en Google Maps <span aria-hidden="true">→</span>
								</a>
									</div>
								</Transition>
							</aside>
						</Transition>
					</div>
				</div>
			</div>
		</section>

		<!-- Footer Values -->
		<section
			class="order-11 relative overflow-hidden border-t border-gray-100 bg-white py-16 transition-colors duration-500 dark:border-slate-800 dark:bg-slate-900 lg:py-20"
		>
			<!-- Decorative elements with secondary colors -->
			<div
				class="absolute -top-12 left-1/4 w-28 h-28 rounded-full border border-cetin-lavender/40 dark:border-cetin-lavender/20 opacity-40"
			></div>
			<div
				class="absolute -bottom-8 right-1/3 w-20 h-20 rounded-full border border-cetin-lime/40 dark:border-cetin-lime/20 opacity-35"
			></div>
			<div
				class="absolute top-1/2 -right-6 w-12 h-12 rounded-full border border-cetin-gold/40 dark:border-cetin-gold/25 opacity-45"
			></div>

			<div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
				<div class="mx-auto mb-10 max-w-2xl text-center">
					<span class="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.16em] text-pink-500">Nuestro compromiso</span>
					<h2 class="text-3xl font-bold text-[#0f2a5c] transition-colors duration-500 dark:text-white lg:text-4xl">
						Cuidado confiable en cada etapa
					</h2>
					<p class="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
						Combinamos experiencia, procesos verificados y acompañamiento para cuidar lo más importante.
					</p>
				</div>

				<div class="relative grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
					<div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cetin-coral/50 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800 lg:p-7">
						<div class="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-cetin-coral transition-transform duration-300 group-hover:scale-x-100"></div>
						<div
							class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cetin-coral/20 transition-transform duration-300 group-hover:scale-105 dark:bg-cetin-coral/30"
						>
							<svg
								class="h-6 w-6 text-cetin-coral"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
								/>
							</svg>
						</div>
						<h3
							class="mb-2 text-lg font-bold text-[#0f2a5c] transition-colors duration-500 dark:text-white"
						>
							Profesionalismo
						</h3>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
							Personal altamente capacitado y comprometido con la
							salud de tu bebé.
						</p>
					</div>

					<div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cetin-turquoise/50 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800 lg:p-7">
						<div class="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-cetin-turquoise transition-transform duration-300 group-hover:scale-x-100"></div>
						<div
							class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cetin-turquoise/20 transition-transform duration-300 group-hover:scale-105 dark:bg-cetin-turquoise/30"
						>
							<svg
								class="h-6 w-6 text-cetin-turquoise"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
								/>
							</svg>
						</div>
						<h3
							class="mb-2 text-lg font-bold text-[#0f2a5c] transition-colors duration-500 dark:text-white"
						>
							Control de Calidad
						</h3>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
							Equipos calibrados y resultados verificados por
							especialistas.
						</p>
					</div>

					<div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cetin-gold/50 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800 lg:p-7">
						<div class="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-cetin-gold transition-transform duration-300 group-hover:scale-x-100"></div>
						<div
							class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cetin-gold/20 transition-transform duration-300 group-hover:scale-105 dark:bg-cetin-gold/30"
						>
							<svg
								class="h-6 w-6 text-cetin-gold"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						</div>
						<h3 class="mb-2 text-lg font-bold text-[#0f2a5c] transition-colors duration-500 dark:text-white">
							Soporte Continuo
						</h3>
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
							Te acompañamos en todo momento durante el proceso de
							tamizaje.
						</p>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
.map-panel-enter-active,
.map-panel-leave-active {
	transition:
		opacity 220ms ease,
		transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.map-panel-enter-from,
.map-panel-leave-to {
	opacity: 0;
	transform: translateX(100%);
}

.branch-detail-enter-active,
.branch-detail-leave-active {
	transition:
		opacity 180ms ease,
		transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.branch-detail-enter-from {
	opacity: 0;
	transform: translateX(14px);
}

.branch-detail-leave-to {
	opacity: 0;
	transform: translateX(-10px);
}

@media (prefers-reduced-motion: reduce) {
	.map-panel-enter-active,
	.map-panel-leave-active,
	.branch-detail-enter-active,
	.branch-detail-leave-active {
		transition: none;
	}
}

:deep(.marcador-cetin > div) {
	transition:
		transform 220ms ease,
		box-shadow 220ms ease,
		filter 220ms ease;
}

:deep(.marcador-cetin.is-active > div) {
	transform: rotate(-45deg) scale(1.22) !important;
	box-shadow:
		0 0 0 7px rgba(233, 30, 140, 0.2),
		0 6px 18px rgba(233, 30, 140, 0.55) !important;
	filter: saturate(1.15) brightness(1.08);
}

:deep(.marcador-cetin:focus-visible) {
	outline: 3px solid rgba(233, 30, 140, 0.45);
	outline-offset: 5px;
	border-radius: 9999px;
}

.branch-card {
	position: relative;
	min-height: 30rem;
	background: #0f172a;
}

.branch-card::after {
	position: absolute;
	inset: 0;
	content: '';
	background: linear-gradient(to top, rgba(2, 6, 23, 0.98) 5%, rgba(2, 6, 23, 0.78) 42%, rgba(2, 6, 23, 0.08) 76%);
	pointer-events: none;
}

.branch-card-image {
	position: absolute;
	inset: 0;
	height: 100%;
	width: 100%;
	object-fit: cover;
	object-position: center;
}

.branch-card-content {
	position: relative;
	z-index: 1;
	margin-top: auto;
	padding-top: 12rem;
}

.branch-card-content > div:last-child {
	display: grid;
	grid-template-columns: auto auto minmax(0, 1fr);
	column-gap: 1rem;
	row-gap: 0.65rem;
	width: 100%;
}

.branch-card-content h3 {
	grid-column: 1 / -1;
	grid-row: 1;
	margin-bottom: 0.5rem;
	font-size: 1.5rem;
	line-height: 1.2;
	color: white !important;
}

.branch-card-content p {
	grid-column: 1 / -1;
	grid-row: 2;
	color: rgb(203 213 225) !important;
}

.branch-card-content > div:last-child > a:not(:last-child) {
	grid-column: 1;
	grid-row: 4;
	align-self: center;
	white-space: nowrap;
	color: rgb(226 232 240) !important;
}

.branch-card-content > div:last-child > div {
	display: contents;
}

.branch-card-content > div:last-child > div a {
	color: rgb(226 232 240) !important;
}

.branch-card-content > div:last-child > div a[href^='mailto:'] {
	grid-column: 1 / -1;
	grid-row: 3;
}

.branch-card-content > div:last-child > div a[href*='facebook'] {
	grid-column: 2;
	grid-row: 4;
	align-self: center;
	white-space: nowrap;
}

.branch-card-content > div:last-child > a:last-child {
	grid-column: 3;
	grid-row: 4;
	justify-self: end;
	margin-top: 0;
	padding: 0.45rem 0.8rem;
	background: rgba(255, 255, 255, 0.1);
	color: white;
	border: 1px solid rgba(255, 255, 255, 0.28);
	border-radius: 9999px;
	box-shadow: none;
	white-space: nowrap;
}

.branch-card-content > div:last-child > a:last-child:hover {
	background: rgba(255, 255, 255, 0.2);
	border-color: rgba(255, 255, 255, 0.5);
	color: white;
	box-shadow: none;
}

@media (max-width: 640px) {
	.branch-card {
		min-height: 26rem;
	}
}

</style>
