<script setup lang="ts">
defineProps<{
  icon: string;
  iconAlt: string;
  iconWidth?: number;
  title: string;
  description: string;
  dataStep?: string | number;
  bgColor?: string;
}>();
</script>

<template>
  <div :class="`w-80 lg:w-96 h-96 bg-white p-3 step relative`" :data="dataStep">
    <div class="w-24 h-24 rounded-full flex flex-col justify-center items-center" :class="bgColor || 'bg-pink-100'">
      <img :src="icon" :alt="iconAlt" :width="iconWidth || 40" />
    </div>
    <div class="mt-5 p-4">
      <h3 class="text-3xl text-tertiary">{{ title }}</h3>
      <p class="mt-2 text-xl leading-tight text-justify">{{ description }}</p>
    </div>
  </div>
</template>
