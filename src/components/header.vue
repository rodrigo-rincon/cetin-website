<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const currentTab = ref('home');
const showModal = ref(false);
const showShadow = ref(false);
const pageSize = ref(0);
const isDark = ref(false);

// Dark mode toggle
const toggleDarkMode = () => {
	isDark.value = !isDark.value;
	if (isDark.value) {
		document.documentElement.classList.add('dark');
		localStorage.setItem('theme', 'dark');
	} else {
		document.documentElement.classList.remove('dark');
		localStorage.setItem('theme', 'light');
	}
};

// Inicializar dark mode desde localStorage
const initDarkMode = () => {
	const savedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia(
		'(prefers-color-scheme: dark)',
	).matches;

	if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
		isDark.value = true;
		document.documentElement.classList.add('dark');
	}
};

// Scroll handler
const handleScroll = () => {
	showShadow.value = window.scrollY > 12;
	
	const sections = document.querySelectorAll('section[id]') as NodeListOf<HTMLElement>;
	const scrollPosition = window.scrollY + window.innerHeight;
	const pageHeight = document.documentElement.scrollHeight;

	if (pageHeight - scrollPosition < 100) {
		currentTab.value = 'contact';
		return;
	}

	sections.forEach((sec) => {
		let top = window.scrollY;
		let offset = sec.offsetTop - 150;
		let sectionHeight = sec.offsetHeight;
		let id = sec.getAttribute('id');
		if (id && top >= offset && top < offset + sectionHeight) {
			getSection(id as string);
		}
	});
};

onMounted(() => {
	initDarkMode();
	window.addEventListener('scroll', handleScroll);
	// Ejecutar una vez para inicializar el estado
	handleScroll();
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});

const showMenuModal = () => {
	showModal.value = true;
};

const hideMenuModal = () => {
	showModal.value = false;
};

const getSection = (section: string) => {
	switch (section) {
		case 'home':
			currentTab.value = 'home';
			break;
		case 'us':
			currentTab.value = 'us';
			break;
		case 'services-info':
			currentTab.value = 'services-info';
			break;
		case 'services':
			currentTab.value = 'services-info';
			break;
		case 'clients':
			currentTab.value = 'clients';
			break;
		case 'contact':
			currentTab.value = 'contact';
			break;
		default:
			currentTab.value = 'home';
			break;
	}
};

const toSection = (section: string) => {
	currentTab.value = section;
	document.getElementById(section)?.scrollIntoView();
	setTimeout(() => {
		hideMenuModal();
	}, 550);
};
</script>

<template>
	<header
		class="w-full bg-white dark:bg-slate-900 sticky top-0 z-50 transition-all duration-300"
		:class="{ 'shadow-lg dark:shadow-slate-800/50': showShadow }"
	>
		<div
			class="max-w-7xl mx-auto flex items-center justify-between py-5 px-6"
		>
			<!-- Logo y nombre -->
			<div
				class="flex items-center space-x-3 cursor-pointer"
				@click="toSection('home')"
			>
				<img
					src="../assets/images/cetin_logo.png"
					class="w-12 h-12"
					alt="Logo CETIN"
				/>
				<div class="flex flex-col">
					<span
						class="text-2xl font-bold text-[#0f2a5c] dark:text-white tracking-tight"
						>CETIN</span
					>
					<span class="text-xs text-gray-500 dark:text-gray-400 -mt-1"
						>Centro de Tamizaje Infantil</span
					>
				</div>
			</div>

			<!-- Navegación principal -->
			<nav class="hidden lg:flex flex-1 justify-center">
				<ul class="flex space-x-1 text-base font-medium bg-gray-100/50 dark:bg-slate-800/50 rounded-full p-1.5">
					<li
						@click="toSection('home')"
						:class="
							currentTab === 'home'
								? 'bg-white dark:bg-slate-700 text-pink-500 dark:text-pink-400 shadow-md'
								: 'text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
						"
						class="relative cursor-pointer px-5 py-2 rounded-full transition-all duration-300 ease-out"
					>
						<span class="relative z-10">Inicio</span>
					</li>
					<li
						@click="toSection('us')"
						:class="
							currentTab === 'us'
								? 'bg-white dark:bg-slate-700 text-pink-500 dark:text-pink-400 shadow-md'
								: 'text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
						"
						class="relative cursor-pointer px-5 py-2 rounded-full transition-all duration-300 ease-out"
					>
						<span class="relative z-10">Nosotros</span>
					</li>
					<li
						@click="toSection('services-info')"
						:class="
							currentTab === 'services-info'
								? 'bg-white dark:bg-slate-700 text-pink-500 dark:text-pink-400 shadow-md'
								: 'text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
						"
						class="relative cursor-pointer px-5 py-2 rounded-full transition-all duration-300 ease-out"
					>
						<span class="relative z-10">Servicios</span>
					</li>
					<li
						@click="toSection('clients')"
						:class="
							currentTab === 'clients'
								? 'bg-white dark:bg-slate-700 text-pink-500 dark:text-pink-400 shadow-md'
								: 'text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
						"
						class="relative cursor-pointer px-5 py-2 rounded-full transition-all duration-300 ease-out"
					>
						<span class="relative z-10">Testimonios</span>
					</li>
					<li
						@click="toSection('contact')"
						:class="
							currentTab === 'contact'
								? 'bg-white dark:bg-slate-700 text-pink-500 dark:text-pink-400 shadow-md'
								: 'text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
						"
						class="relative cursor-pointer px-5 py-2 rounded-full transition-all duration-300 ease-out"
					>
						<span class="relative z-10">Contacto</span>
					</li>
				</ul>
			</nav>

			<!-- Dark mode toggle + CTA Button -->
			<div class="hidden lg:flex items-center gap-3">
				<!-- Dark Mode Toggle -->
				<button
					@click="toggleDarkMode"
					class="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
				>
					<!-- Sol (light mode) -->
					<svg
						v-if="isDark"
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
							clip-rule="evenodd"
						/>
					</svg>
					<!-- Luna (dark mode) -->
					<svg
						v-else
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
						/>
					</svg>
				</button>

				<a
					href="#contact"
					class="group inline-flex items-center bg-primary hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 hover:shadow-pink-500/40 active:scale-95"
				>
					<svg
						class="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12"
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
					Contáctanos
				</a>
			</div>

			<!-- Menú móvil -->
			<div class="lg:hidden flex items-center gap-2">
				<!-- Dark Mode Toggle Mobile -->
				<button
					@click="toggleDarkMode"
					class="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
				>
					<svg
						v-if="isDark"
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
							clip-rule="evenodd"
						/>
					</svg>
					<svg
						v-else
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
						/>
					</svg>
				</button>
				<button
					@click="showMenuModal"
					class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-primary transition"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						width="28"
						height="28"
					>
						<path
							stroke-linecap="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Barra de colores identidad - aparece al hacer scroll -->
		<transition name="slide-down">
			<div v-if="showShadow" class="w-full h-1 flex">
				<div class="flex-1 bg-cetin-coral"></div>
				<div class="flex-1 bg-cetin-turquoise"></div>
				<div class="flex-1 bg-cetin-gold"></div>
				<div class="flex-1 bg-cetin-lavender"></div>
				<div class="flex-1 bg-cetin-lime"></div>
			</div>
		</transition>

		<!-- Menú móvil desplegable -->
		<transition name="fade">
			<div
				v-if="showModal"
				class="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col"
			>
				<!-- Header del modal -->
				<div
					class="flex items-center justify-between p-6 border-b dark:border-slate-700"
				>
					<div class="flex items-center space-x-3">
						<img
							src="../assets/images/cetin_logo.png"
							class="w-10 h-10"
							alt="Logo CETIN"
						/>
						<span
							class="text-xl font-bold text-[#0f2a5c] dark:text-white"
							>CETIN</span
						>
					</div>
					<button
						@click="hideMenuModal"
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							width="28"
							height="28"
						>
							<path
								stroke-linecap="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<!-- Menu items -->
				<nav class="flex-1 p-6">
					<ul class="flex flex-col space-y-2">
						<li
							@click="toSection('home')"
							class="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-700 dark:text-gray-300 hover:text-primary transition"
						>
							<span
								class="w-3 h-3 bg-pink-500 rounded-full"
							></span>
							<span class="text-lg font-medium">Inicio</span>
						</li>
						<li
							@click="toSection('us')"
							class="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-700 dark:text-gray-300 hover:text-primary transition"
						>
							<span
								class="w-3 h-3 bg-pink-500 rounded-full"
							></span>
							<span class="text-lg font-medium">Nosotros</span>
						</li>
						<li
							@click="toSection('services-info')"
							class="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-700 dark:text-gray-300 hover:text-primary transition"
						>
							<span
								class="w-3 h-3 bg-pink-500 rounded-full"
							></span>
							<span class="text-lg font-medium">Servicios</span>
						</li>
						<li
							@click="toSection('clients')"
							class="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-700 dark:text-gray-300 hover:text-primary transition"
						>
							<span
								class="w-3 h-3 bg-pink-500 rounded-full"
							></span>
							<span class="text-lg font-medium">Testimonios</span>
						</li>
						<li
							@click="toSection('contact')"
							class="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-700 dark:text-gray-300 hover:text-primary transition"
						>
							<span
								class="w-3 h-3 bg-pink-500 rounded-full"
							></span>
							<span class="text-lg font-medium">Contacto</span>
						</li>
					</ul>
				</nav>

				<!-- CTA en mobile -->
				<div class="p-6 border-t dark:border-slate-700">
					<a
						href="#contact"
						@click="hideMenuModal"
						class="flex items-center justify-center w-full bg-primary hover:bg-pink-600 text-white font-semibold px-6 py-4 rounded-xl transition"
					>
						<svg
							class="w-5 h-5 mr-2"
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
						Contáctanos
					</a>
				</div>
			</div>
		</transition>
	</header>
</template>

<style scoped>
/* Animación slide-down para la barra de colores */
.slide-down-enter-active,
.slide-down-leave-active {
	transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
	transform: translateY(-100%);
	opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
	transform: translateY(0);
	opacity: 1;
}
</style>
