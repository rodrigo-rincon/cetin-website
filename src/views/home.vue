<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Carousel from '../components/carousel.vue';
import HeroSection from '../components/HeroSection.vue';
import InfoSection from '../components/InfoSection.vue';
import { useReadonlyContent } from '../composables/useContent';
import {
	vFadeUp,
	vSlideLeft,
	vSlideRight,
	vScaleUp,
} from '../directives/scrollReveal';

const { content } = useReadonlyContent();

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

// MapLibre types
declare const maplibregl: {
	Map: new (options: { container: string; style: string; bounds?: any; fitBoundsOptions?: any; scrollZoom?: boolean }) => any;
	NavigationControl: new () => any;
	Marker: new (options?: { element?: HTMLElement }) => any;
	Popup: new (options?: { offset?: number }) => any;
	LngLatBounds: new () => { extend: (coord: [number, number]) => void };
};
declare const OpenLocationCode: {
	encode(lat: number, lng: number, codeLength?: number): string;
	decode(code: string): { latitudeCenter: number; longitudeCenter: number };
	recoverNearest(code: string, lat: number, lng: number): string;
};

// Inicializar mapa de sucursales
const initMap = () => {
	const REF = {
		CDMX: { lat: 19.4326077, lng: -99.133208 },
		SAN_ANDRES_CHOLULA: { lat: 19.0528, lng: -98.2986 },
		CUAUTITLAN_IZCALLI: { lat: 19.6727, lng: -99.2078 },
		EMILIANO_ZAPATA: { lat: 19.3833, lng: -98.95 },
	};

	const places = [
		{
			name: 'CETIN Puebla',
			plus: '2QH8+43',
			ref: REF.SAN_ANDRES_CHOLULA,
			phone: '221 191 1419',
			city: 'San Andrés Cholula, Puebla',
		},
		{
			name: 'CETIN Roma Sur',
			plus: 'CR4M+G3',
			ref: REF.CDMX,
			phone: '55 3459 9088',
			city: 'Ciudad de México',
		},
		{
			name: 'CETIN Lindavista',
			plus: 'FVRF+72',
			ref: REF.CDMX,
			phone: '55 3459 9088',
			city: 'Ciudad de México',
		},
		{
			name: 'CETIN Los Reyes',
			plus: '923C+XF',
			ref: REF.EMILIANO_ZAPATA,
			phone: '55 1833 4557',
			city: 'Emiliano Zapata, Edo. de México',
		},
		{
			name: 'CETIN Cuautitlán',
			plus: 'MQ3R+PQ',
			ref: REF.CUAUTITLAN_IZCALLI,
			phone: '55 7223 2421',
			city: 'Cuautitlán Izcalli, Edo. de México',
		},
	];

	const elementoMapa = document.getElementById('cetin-map');
	if (!elementoMapa) {
		console.warn('Map container not found');
		return;
	}

	console.log('Initializing map, maplibregl:', typeof window.maplibregl, 'OpenLocationCode:', typeof window.OpenLocationCode);

	// Calcular límites del mapa
	const limites = new maplibregl.LngLatBounds();
	const marcadores: { lat: number; lng: number; sucursal: any }[] = [];

	places.forEach((p) => {
		const codigoCompleto = OpenLocationCode.recoverNearest(
			p.plus,
			p.ref.lat,
			p.ref.lng,
		);
		const area = OpenLocationCode.decode(codigoCompleto);
		const lat = area.latitudeCenter;
		const lng = area.longitudeCenter;
		limites.extend([lng, lat]);
		marcadores.push({ lat, lng, sucursal: p });
	});

	// Crear mapa con MapLibre - Estilo verde natural con labels en español
	const mapa = new maplibregl.Map({
		container: 'cetin-map',
		style: 'https://tiles.stadiamaps.com/styles/outdoors.json',
		bounds: limites,
		fitBoundsOptions: { padding: 60, maxZoom: 12 },
		scrollZoom: false,
	});

	// Cambiar labels a español cuando el estilo cargue
	mapa.on('styledata', () => {
		const capas = mapa.getStyle()?.layers || [];
		capas.forEach((capa: any) => {
			if (capa.layout && capa.layout['text-field']) {
				const campoTexto = capa.layout['text-field'];
				// Si el campo usa coalesce con name:en, cambiarlo a español
				if (Array.isArray(campoTexto) || typeof campoTexto === 'object') {
					mapa.setLayoutProperty(capa.id, 'text-field', [
						'coalesce',
						['get', 'name:es'],
						['get', 'name:latin'],
						['get', 'name'],
					]);
				}
			}
		});
	});

	// Agregar controles de navegación
	mapa.addControl(new maplibregl.NavigationControl(), 'top-right');

	// Agregar marcadores cuando el mapa esté listo
	mapa.on('load', () => {
		marcadores.forEach(({ lat, lng, sucursal }) => {
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

			// Crear ventana emergente
			const ventana = new maplibregl.Popup({ offset: 25 }).setHTML(`
				<div style="text-align: center; min-width: 180px; padding: 8px;">
					<b style="color: #0f2a5c; font-size: 14px;">${sucursal.name}</b>
					<br/>
					<span style="color: #666; font-size: 12px;">${sucursal.city}</span>
					<br/>
					<a href="tel:${sucursal.phone.replace(/\s/g, '')}" style="color: #E91E8C; font-weight: 500; font-size: 13px; text-decoration: none;">
						📞 ${sucursal.phone}
					</a>
				</div>
			`);

			// Agregar marcador al mapa
			new maplibregl.Marker({ element: el })
				.setLngLat([lng, lat])
				.setPopup(ventana)
				.addTo(mapa);
		});
	});
};

const loadMapLibre = async (): Promise<void> => {
  if (typeof window.maplibregl !== 'undefined') {
    initMap();
    return;
  }

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  try {
    await Promise.all([
      loadScript('https://unpkg.com/maplibre-gl@4.0.0/dist/maplibre-gl.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/openlocationcode/1.0.4/openlocationcode.min.js'),
    ]);
    initMap();
  } catch (e) {
    console.error('Failed to load map libraries:', e);
  }
};

onMounted(() => {
  loadMapLibre();
});
</script>

<template>
	<div class="main flex flex-col w-full relative bg-white dark:bg-slate-900">
		<HeroSection />

		<!-- Copy Section -->
		<section
			class="py-20 bg-white dark:bg-slate-900 relative overflow-hidden"
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
				class="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10"
			>
				<h2
					class="text-3xl lg:text-5xl font-bold text-[#0f2a5c] dark:text-white leading-tight mb-6"
				>
					{{ content.videosSection.title }}
				</h2>
				<p
					class="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-5xl mx-auto"
				>
					{{ content.videosSection.subtitle }}
				</p>
			</div>

			<!-- Videos Section -->
			<div
				v-fade-up="{ delay: 200 }"
				class="max-w-7xl mx-auto px-6 lg:px-12 mt-16"
			>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
					<!-- Dynamic Videos -->
					<div v-for="video in content.videosSection.videos" :key="video.id" class="group">
						<div
							class="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
						>
							<!-- Video -->
							<div class="aspect-video">
								<iframe
									class="w-full h-full"
									:src="video.youtubeUrl"
									:title="video.title"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
									allowfullscreen
								></iframe>
							</div>
							<!-- Caption -->
							<div
								class="p-5 bg-[#0f2a5c] flex items-start gap-4"
							>
								<div class="flex -space-x-2 shrink-0">
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
								<p class="text-white text-sm leading-relaxed">
									"{{ video.description }}"
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
			class="py-20 bg-gray-50 dark:bg-slate-800 relative overflow-hidden"
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
				<div
					class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
				>
					<!-- Left: Features -->
					<div v-slide-right class="space-y-8">
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
						<div class="space-y-6">
							<div
								class="flex items-start gap-5 p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
								class="flex items-start gap-5 p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
								class="flex items-start gap-5 p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
								class="flex items-start gap-5 p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
					<div v-slide-left class="relative">
						<div
							class="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-10 lg:p-12"
						>
							<h3
								class="text-2xl lg:text-3xl font-bold text-[#0f2a5c] dark:text-white mb-4"
							>
								Tecnología avanzada para detectar enfermedades
								con precisión
							</h3>
							<p
								class="text-gray-600 dark:text-gray-400 text-lg mb-10"
							>
								En CETIN utilizamos los equipos más modernos del
								mercado para garantizar resultados confiables.
							</p>

							<!-- Stats -->
							<div class="grid grid-cols-2 gap-6">
								<div
									class="text-center p-5 bg-pink-50 dark:bg-pink-900/30 rounded-2xl"
								>
									<p
										class="text-3xl lg:text-4xl font-bold text-pink-500 mb-2"
									>
										{{ content.stats.bebesAtendidos }}
									</p>
									<p
										class="text-gray-600 dark:text-gray-400 font-medium text-sm"
									>
										{{ content.stats.bebesAtendidosLabel }}
									</p>
								</div>
								<div
									class="text-center p-5 bg-blue-50 dark:bg-blue-900/30 rounded-2xl"
								>
									<p
										class="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"
									>
										{{ content.stats.citasAgendadas }}
									</p>
									<p
										class="text-gray-600 dark:text-gray-400 font-medium text-sm"
									>
										{{ content.stats.citasAgendadasLabel }}
									</p>
								</div>
							</div>

							<a
								href="#contact"
								class="group inline-flex items-center justify-center w-full mt-10 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/30 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40 active:scale-95"
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
								Agendar una cita
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Servicios -->
		<InfoSection />

		<!-- Labor Altruista Section -->
		<section class="py-24 bg-[#0f2a5c] relative overflow-hidden">
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
							class="text-3xl lg:text-5xl font-bold text-blue-50 leading-tight mb-6"
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
			class="py-24 bg-gradient-to-b from-pink-500 via-pink-500 to-pink-600 relative overflow-hidden"
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

		<!-- Aval Section - Marquee -->
		<section class="py-12 bg-[#0f2a5c] overflow-hidden">
			<div class="marquee-container">
				<div class="marquee-content">
					<span class="marquee-text"
						>Todos los resultados de los tamices son avalados por
						médicos subespecialistas expertos en cada área.</span
					>
					<span class="marquee-separator">✦</span>
					<span class="marquee-text"
						>Todos los resultados de los tamices son avalados por
						médicos subespecialistas expertos en cada área.</span
					>
					<span class="marquee-separator">✦</span>
					<span class="marquee-text"
						>Todos los resultados de los tamices son avalados por
						médicos subespecialistas expertos en cada área.</span
					>
					<span class="marquee-separator">✦</span>
					<span class="marquee-text"
						>Todos los resultados de los tamices son avalados por
						médicos subespecialistas expertos en cada área.</span
					>
					<span class="marquee-separator">✦</span>
				</div>
			</div>
		</section>

		<!-- Nueva Sucursal Section -->
		<section ref="parallaxSucursal" class="py-32 relative overflow-hidden">
			<!-- Background Image with Parallax -->
			<div class="absolute inset-0 overflow-hidden">
				<img
					src="../assets/images/cetin_ciudad_de_mexico.jpg"
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
					class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-100 leading-tight mb-4"
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
			class="py-20 bg-white dark:bg-slate-900 relative overflow-hidden"
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
				<div v-fade-up class="text-center mb-16">
					<span
						class="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 uppercase tracking-wider mb-4"
					>
						<span class="w-8 h-[2px] bg-pink-500"></span>
						Testimonios
						<span class="w-8 h-[2px] bg-pink-500"></span>
					</span>
					<h2
						class="text-3xl lg:text-5xl font-bold text-[#0f2a5c] dark:text-white leading-tight"
					>
						Lo que dicen nuestros
						<span class="text-pink-500">clientes</span>
					</h2>
					<p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						El 99% de nuestros pacientes se encuentran satisfechos con nuestros servicios
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
			class="py-20 bg-gray-50 dark:bg-slate-800 relative overflow-hidden"
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
				class="flex justify-center lg:absolute lg:left-0 lg:-bottom-4 pointer-events-none z-20 mb-6 lg:mb-0"
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
				<div v-fade-up class="text-center mb-12">
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
						class="group relative p-8 bg-gradient-to-br from-[#0f2a5c] via-[#143366] to-[#1a3a6c] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
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
						class="group relative p-8 bg-gradient-to-br from-pink-500 via-pink-500 to-pink-600 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
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
					<span
						class="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider"
						>Nuestras Sucursales</span
					>
					<div
						class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent"
					></div>
				</div>

				<!-- Sucursales Grid -->
				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
				>
					<!-- Puebla -->
					<a
						href="https://www.google.com/maps/place/CETIN+Puebla/@19.0278616,-98.237383,17z/data=!3m1!4b1!4m6!3m5!1s0x85cfc117dcd367d1:0x3781456e2b7b67bf!8m2!3d19.0278616!4d-98.2348081!16s%2Fg%2F11sk1hrbrk?entry=ttu"
						target="_blank"
						class="group p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-600 hover:-translate-y-1"
					>
						<div class="flex items-start gap-4">
							<div
								class="w-11 h-11 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500 transition-colors"
							>
								<svg
									class="w-5 h-5 text-pink-500 dark:text-pink-400 group-hover:text-white transition-colors"
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
							<div>
								<h3
									class="font-bold text-[#0f2a5c] dark:text-white mb-1"
								>
									Puebla
								</h3>
								<p
									class="text-sm text-gray-500 dark:text-gray-400 mb-2"
								>
									Blvrd del Niño Poblano 2501-B local 5-B,
									Reserva Territorial Atlixcáyotl, 72450 San
									Andrés Cholula, Pue.
								</p>
								<a
									href="tel:+522211911419"
									class="inline-flex items-center gap-2 text-sm text-pink-500 font-medium hover:text-pink-600"
									@click.stop
								>
									<svg
										class="w-4 h-4"
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
									221 191 1419
								</a>
							</div>
						</div>
					</a>

					<!-- Los Reyes la Paz -->
					<a
						href="https://www.google.com/maps/place/Tamiz+Neonatal+Cetin+M%C3%A9xico+Los+Reyes/@19.3549368,-98.9813748,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1e375bf60eceb:0x3816aff1b36b4de0!8m2!3d19.3549368!4d-98.9787999!16s%2Fg%2F11w3t5cly1?entry=ttu"
						target="_blank"
						class="group p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1"
					>
						<div class="flex items-start gap-4">
							<div
								class="w-11 h-11 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors"
							>
								<svg
									class="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors"
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
							<div>
								<h3
									class="font-bold text-[#0f2a5c] dark:text-white mb-1"
								>
									Los Reyes
								</h3>
								<p
									class="text-sm text-gray-500 dark:text-gray-400 mb-2"
								>
									Carr. Federal México-Puebla 62, Los Reyes,
									56400 Emiliano Zapata, Méx.
								</p>
								<a
									href="tel:+525518334557"
									class="inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700"
									@click.stop
								>
									<svg
										class="w-4 h-4"
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
									55 1833 4557
								</a>
							</div>
						</div>
					</a>

					<!-- Roma Sur -->
					<a
						href="https://www.google.com/maps/place/CETIN+ROMA+SUR/@19.4063121,-99.1698302,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1ff000a76b681:0xf6f654e0c0850fb9!8m2!3d19.4063121!4d-99.1672553!16s%2Fg%2F11wnk8_gps?entry=ttu"
						target="_blank"
						class="group p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-yellow-300 dark:hover:border-yellow-600 hover:-translate-y-1"
					>
						<div class="flex items-start gap-4">
							<div
								class="w-11 h-11 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500 transition-colors"
							>
								<svg
									class="w-5 h-5 text-yellow-600 dark:text-yellow-400 group-hover:text-white transition-colors"
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
							<div>
								<h3
									class="font-bold text-[#0f2a5c] dark:text-white mb-1"
								>
									Roma Sur
								</h3>
								<p
									class="text-sm text-gray-500 dark:text-gray-400 mb-2"
								>
									Tepic 139, Roma Sur, Cuauhtémoc, 06760
									Ciudad de México, CDMX
								</p>
								<a
									href="tel:+525534599088"
									class="inline-flex items-center gap-2 text-sm text-yellow-600 font-medium hover:text-yellow-700"
									@click.stop
								>
									<svg
										class="w-4 h-4"
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
									55 3459 9088
								</a>
							</div>
						</div>
					</a>

					<!-- Cuautitlán Izcalli -->
					<a
						href="https://www.google.com/maps/place/CETIN+Cuautitl%C3%A1n+Izcalli/@19.6542518,-99.2106628,17z/data=!3m1!4b1!4m6!3m5!1s0x85d21f7c5e465717:0xe08b10f9241090c2!8m2!3d19.6542518!4d-99.2080879!16s%2Fg%2F11x7k4jgwq?entry=ttu"
						target="_blank"
						class="group p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:-translate-y-1"
					>
						<div class="flex items-start gap-4">
							<div
								class="w-11 h-11 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 transition-colors"
							>
								<svg
									class="w-5 h-5 text-purple-500 dark:text-purple-400 group-hover:text-white transition-colors"
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
							<div>
								<h3
									class="font-bold text-[#0f2a5c] dark:text-white mb-1"
								>
									Cuautitlán Izcalli
								</h3>
								<p
									class="text-sm text-gray-500 dark:text-gray-400 mb-2"
								>
									And. París 24-Loc.1, Centro Urbano, 54700
									Cuautitlán Izcalli, Méx.
								</p>
								<a
									href="tel:+525572232421"
									class="inline-flex items-center gap-2 text-sm text-purple-500 font-medium hover:text-purple-600"
									@click.stop
								>
									<svg
										class="w-4 h-4"
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
									55 7223 2421
								</a>
							</div>
						</div>
					</a>

					<!-- Lindavista -->
					<a
						href="https://www.google.com/maps/place/CETIN+Lindavista/@19.4906913,-99.1323058,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f986fee9617b:0x4e707691c09bc60c!8m2!3d19.4906914!4d-99.1274349!16s%2Fg%2F11xz2rf_ps?entry=ttu"
						target="_blank"
						class="group p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 hover:-translate-y-1"
					>
						<div class="flex items-start gap-4">
							<div
								class="w-11 h-11 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 transition-colors"
							>
								<svg
									class="w-5 h-5 text-teal-500 dark:text-teal-400 group-hover:text-white transition-colors"
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
							<div>
								<h3
									class="font-bold text-[#0f2a5c] dark:text-white mb-1"
								>
									Lindavista
								</h3>
								<p
									class="text-sm text-gray-500 dark:text-gray-400 mb-2"
								>
									Riobamba 758, Lindavista Sur, Gustavo A.
									Madero, 07300 Ciudad de México, CDMX
								</p>
								<a
									href="tel:+525534599088"
									class="inline-flex items-center gap-2 text-sm text-teal-500 font-medium hover:text-teal-600"
									@click.stop
								>
									<svg
										class="w-4 h-4"
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
									55 3459 9088
								</a>
							</div>
						</div>
					</a>
				</div>

				<!-- Map with all locations -->
				<div class="relative">
					<div
						class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden"
						style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.1);"
					>
						<div id="cetin-map" style="width:100%;height:450px;min-height:400px;display:flex;align-items:center;justify-content:center;background:#f1f5f9;">
							<p style="color:#64748b;font-size:14px;">Cargando mapa...</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Footer Values -->
		<section
			class="py-16 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 relative overflow-hidden"
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
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div class="text-center p-8">
						<div
							class="w-16 h-16 bg-cetin-coral/20 dark:bg-cetin-coral/30 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-8 h-8 text-cetin-coral"
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
							class="text-xl font-bold text-[#0f2a5c] dark:text-white mb-2"
						>
							Profesionalismo
						</h3>
						<p class="text-gray-600 dark:text-gray-400">
							Personal altamente capacitado y comprometido con la
							salud de tu bebé.
						</p>
					</div>

					<div class="text-center p-8">
						<div
							class="w-16 h-16 bg-cetin-turquoise/20 dark:bg-cetin-turquoise/30 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-8 h-8 text-cetin-turquoise"
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
							class="text-xl font-bold text-[#0f2a5c] dark:text-white mb-2"
						>
							Control de Calidad
						</h3>
						<p class="text-gray-600 dark:text-gray-400">
							Equipos calibrados y resultados verificados por
							especialistas.
						</p>
					</div>

					<div class="text-center p-8">
						<div
							class="w-16 h-16 bg-cetin-gold/20 dark:bg-cetin-gold/30 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-8 h-8 text-cetin-gold"
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
						<h3 class="text-xl font-bold text-[#0f2a5c] dark:text-white mb-2">
							Soporte Continuo
						</h3>
						<p class="text-gray-600 dark:text-gray-400">
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
.marquee-container {
	display: flex;
	width: 100%;
}

.marquee-content {
	display: flex;
	white-space: nowrap;
	animation: marquee 50s linear infinite;
}

.marquee-text {
	font-size: clamp(1.1rem, 2.5vw, 1.75rem);
	font-weight: 500;
	color: white;
	font-style: italic;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	padding: 0 1rem;
}

.marquee-separator {
	font-size: clamp(1.1rem, 2.5vw, 1.75rem);
	color: #f9a8d4;
	padding: 0 2rem;
}

@keyframes marquee {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-50%);
	}
}

.marquee-container:hover .marquee-content {
	animation-play-state: paused;
}
</style>

<!-- Adding the MapLibre CSS from jsdelivr as an alternative CDN -->
<link href="https://cdn.jsdelivr.net/npm/maplibre-gl@4.0.0/dist/maplibre-gl.css" rel="stylesheet" />
