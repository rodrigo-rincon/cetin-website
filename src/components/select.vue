<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';

defineProps([
	'text',
	'placeholder',
	'type',
	'icon',
	'value',
	'options',
	'modelValue',
	'value',
	'name',
]);
defineEmits(['update:modelValue', 'blur']);
</script>

<template>
	<div class="p-3 w-full relative mb-3">
		<div class="w-full relative">
			<Field
				v-slot="{ value }"
				:name="name"
				:value="modelValue"
				as="select"
				@change="$emit('update:modelValue', $event.target.value)"
				required
				class="select border-2 border-primary shadow-md py-3 pl-[80px] w-full text-xl text-title bg-primary focus:outline-none focus:bg-white focus:border-tertiary focus:rounded-lg"
			>
				<option value="" disabled selected>
					Seleccione un servicio
				</option>
				<option
					v-for="option in options"
					:key="option.id"
					:value="option.id"
				>
					{{ option.name }}
				</option>
				{{ value }}
			</Field>
			<div
				class="border-2 border-tertiary flex w-16 absolute bg-tertiary h-full justify-center items-center top-0"
			>
				<img src="../assets/images/form-icons/service.svg" width="30" />
			</div>
		</div>
		<ErrorMessage
			:name="name"
			class="absolute -bottom-3 text-sm text-red-400 italic"
			id="error"
		/>
	</div>
</template>
<style lang="css">
select:required:invalid {
	color: #9ca3af;
}
</style>
