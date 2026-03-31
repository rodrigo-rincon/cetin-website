<script setup lang="ts">
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';
import Chatbot from '../components/Chatbot.vue';
</script>

<template>
	<div class="bg-white dark:bg-slate-900 w-full relative">
		<div
			class="fixed bg-white dark:bg-slate-900 flex justify-center items-center w-full z-50"
		>
			<Header></Header>
		</div>
		<div class="container-section w-full overflow-hidden relative">
			<router-view></router-view>
		</div>
		<div class="footer w-full">
			<Footer></Footer>
		</div>

		<!-- Chatbot -->
		<Chatbot />
	</div>
</template>
