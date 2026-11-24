<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';
import Chatbot from '../components/Chatbot.vue';
import AppointmentWhatsAppModal from '../components/AppointmentWhatsAppModal.vue';
import CookieConsent from '../components/CookieConsent.vue';

const route = useRoute();
const showLayout = computed(() => route.path === '/');
const showFooter = computed(() => showLayout.value || route.meta.legalDocument);

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

let smoother: ReturnType<typeof ScrollSmoother.create> | null = null;

const scrollToSection = (target: string | Element) => {
	if (!smoother) return false;
	const destination = typeof target === 'string' ? document.querySelector(target) : target;
	if (!destination) return false;
	smoother.scrollTo(destination, true, 'top 112px');
	return true;
};

const handleSectionRequest = (event: Event) => {
	const customEvent = event as CustomEvent<{ id?: string }>;
	if (!customEvent.detail?.id) return;
	if (scrollToSection(`#${customEvent.detail.id}`)) customEvent.preventDefault();
};

const handleAnchorClick = (event: MouseEvent) => {
	const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
	if (!anchor) return;
	const destination = new URL(anchor.href, window.location.href);
	if (destination.origin !== window.location.origin || destination.pathname !== '/' || !destination.hash) return;
	if (scrollToSection(destination.hash)) event.preventDefault();
};

const destroySmoother = () => {
	smoother?.kill();
	smoother = null;
	document.documentElement.classList.remove('gsap-smooth-active');
};

const setupSmoother = async () => {
	destroySmoother();
	if (!showLayout.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	await nextTick();
	document.documentElement.classList.add('gsap-smooth-active');
	smoother = ScrollSmoother.create({
		wrapper: '#smooth-wrapper',
		content: '#smooth-content',
		smooth: 1.15,
		smoothTouch: 0,
		effects: true,
		normalizeScroll: false,
		ignoreMobileResize: true,
	});
	ScrollTrigger.refresh();
};

watch(showLayout, setupSmoother);

onMounted(() => {
	window.addEventListener('cetin-scroll-to', handleSectionRequest);
	document.addEventListener('click', handleAnchorClick);
	void setupSmoother();
});

onBeforeUnmount(() => {
	window.removeEventListener('cetin-scroll-to', handleSectionRequest);
	document.removeEventListener('click', handleAnchorClick);
	destroySmoother();
});
</script>

<template>
	<div class="bg-white dark:bg-slate-900 w-full relative" :class="{ 'public-site': showLayout }">
		<div
			v-if="showLayout"
			class="fixed bg-white dark:bg-slate-900 flex justify-center items-center w-full z-50"
		>
			<Header></Header>
		</div>
		<div id="smooth-wrapper">
			<div id="smooth-content">
				<div class="container-section w-full overflow-x-clip relative" :class="{ 'pt-0': !showLayout }">
					<router-view></router-view>
				</div>
				<Footer v-if="showFooter"></Footer>
			</div>
		</div>

		<!-- Chatbot -->
		<Chatbot v-if="showLayout" />
		<AppointmentWhatsAppModal v-if="showLayout" />
		<CookieConsent v-if="showLayout" />
	</div>
</template>
