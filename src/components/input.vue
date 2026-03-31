<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';

defineProps([
	'text',
	'placeholder',
	'type',
	'icon',
	'modelValue',
	'name',
	'maxlength',
]);
defineEmits(['update:modelValue', 'blur']);
const getIcon = (icon: string) => {
	switch (icon) {
		case 'user':
			return 'src/assets/images/form-icons/user.svg';
			break;
		case 'baby':
			return 'src/assets/images/form-icons/baby.svg';
			break;
		case 'mail':
			return 'src/assets/images/form-icons/mail.svg';
			break;
		case 'phone':
			return 'src/assets/images/form-icons/phone.svg';
			break;

		default:
			break;
	}
};
</script>

<template>
	<div class="p-3 w-full relative mb-3">
		<div class="w-full relative">
			<Field
				required
				:value="modelValue"
				@input="
					$emit(
						'update:modelValue',
						($event.target as HTMLInputElement).value
					)
				"
				:maxlength="maxlength"
				:type="type"
				:name="name"
				:placeholder="placeholder"
				class="relative border-2 border-primary shadow-md py-3 pl-[80px] w-full text-xl text-title bg-primary focus:outline-none focus:bg-white focus:border-tertiary transition-all ease-linear delay-100 focus:rounded-lg"
			></Field>
			<div
				class="border-2 border-tertiary flex w-16 absolute bg-tertiary h-full justify-center items-center top-0"
			>
				<img :src="getIcon(icon)" width="30" />
			</div>
		</div>
		<ErrorMessage
			:name="name"
			class="absolute -bottom-3 text-sm text-red-400 italic"
			id="error"
		/>
	</div>
</template>
