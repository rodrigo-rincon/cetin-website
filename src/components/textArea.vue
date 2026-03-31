<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';

defineProps([
	'text',
	'placeholder',
	'type',
	'icon',
	'modelValue',
	'name',
	'rows',
	'cols',
]);
defineEmits(['update:modelValue', 'blur']);
</script>

<template>
	<div class="p-3 w-full relative mb-3">
		<div class="w-full relative">
			<Field
				as="textarea"
				:value="modelValue"
				:name="name"
				@change="$emit('update:modelValue', $event.target.value)"
				:placeholder="placeholder"
				class="border-2 border-primary shadow-md py-3 -mb-1.5 pl-[80px] w-full text-xl text-title bg-primary focus:outline-none focus:bg-white focus:border-tertiary transition-all ease-linear delay-100 focus:rounded-lg"
				:rows="rows"
				:cols="cols"
			></Field>
			<div
				class="border-2 border-tertiary flex w-16 absolute bg-tertiary h-full justify-center items-start top-0"
			>
				<img
					src="../assets/images/form-icons/textarea.svg"
					class="mt-5"
					width="30"
				/>
			</div>
		</div>
		<ErrorMessage
			:name="name"
			class="absolute -bottom-3 text-sm text-red-400 italic"
			id="error"
		/>
	</div>
</template>
