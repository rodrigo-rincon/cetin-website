<script setup lang="ts">
defineProps<{
	icon: string;
	iconAlt: string;
	iconWidth?: number;
	title: string;
	description: string;
	bgColor?: string;
}>();
</script>

<template>
	<div :class="`w-80 h-80 ${bgColor || 'bg-primary'} p-3`">
		<div
			class="t-icon w-24 h-24 rounded-full flex flex-col justify-center items-center"
			:class="bgColor ? '' : 'bg-orange-200'"
		>
			<img :src="icon" :alt="iconAlt" :width="iconWidth || 50" />
		</div>
		<div class="mt-5 p-4">
			<h3 class="text-2xl text-tertiary font-medium">{{ title }}</h3>
			<p class="text-justify text-gray-500 leading-tight">
				{{ description }}
			</p>
		</div>
	</div>
</template>
