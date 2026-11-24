<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';
import Chatbot from '../components/Chatbot.vue';
import AppointmentWhatsAppModal from '../components/AppointmentWhatsAppModal.vue';

const route = useRoute();
const showLayout = computed(() => route.path === '/');
const showFooter = computed(() => showLayout.value || route.meta.legalDocument);
</script>

<template>
	<div class="bg-white dark:bg-slate-900 w-full relative" :class="{ 'public-site clay-site': showLayout }">
		<div
			v-if="showLayout"
			class="fixed bg-white dark:bg-slate-900 flex justify-center items-center w-full z-50"
		>
			<Header></Header>
		</div>
		<div class="container-section w-full overflow-x-clip relative" :class="{ 'pt-0': !showLayout }">
			<router-view></router-view>
		</div>
		<Footer v-if="showFooter"></Footer>

		<!-- Chatbot -->
		<Chatbot v-if="showLayout" />
		<AppointmentWhatsAppModal v-if="showLayout" />
	</div>
</template>
