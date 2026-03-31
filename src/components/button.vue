<script setup lang="ts">
defineProps(['text', 'disabled']);
</script>

<template>
	<div class="">
		<button
			:disabled="disabled"
			class="button bg-secondary p-3 lg:p-4 text-primary rounded-xl flex flex-row items-center space-x-4"
		>
			<span
				class="disabled:cursor-not-allowed lg:text-xl capitalize font-medium"
				>{{ text }}</span
			>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-8 -rotate-45"
				viewBox="0 0 24 24"
			>
				<path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 12h2.5M20 12l-6-6m6 6l-6 6m6-6H9.5"
				/>
			</svg>
		</button>
	</div>
</template>

<style lang="css">
.button:hover {
	box-shadow: rgba(14, 63, 126, 0.06) 0px 0px 0px 1px,
		rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px,
		rgba(42, 51, 70, 0.04) 0px 2px 2px -1px,
		rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px,
		rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px,
		rgba(42, 51, 70, 0.03) 0px 10px 10px -5px,
		rgba(42, 51, 70, 0.03) 0px 24px 24px -8px;
}
</style>
