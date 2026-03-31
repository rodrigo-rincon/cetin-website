<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import {
	testimonials,
	branchColors,
	type Testimonial,
} from '../data/testimonials';

const currentIndex = ref(0);
let intervalId: ReturnType<typeof setInterval> | null = null;
const progressWidth = ref(0);
let progressIntervalId: ReturnType<typeof setInterval> | null = null;

// Filtro por sucursal (opcional)
const selectedBranch = ref<string | null>(null);

const filteredTestimonials = computed(() => {
	if (!selectedBranch.value) return testimonials;
	return testimonials.filter((t) => t.branch === selectedBranch.value);
});

// Show 3 cards at a time on desktop, 1 on mobile
const visibleCards = computed(() => {
	const cards: Testimonial[] = [];
	const list = filteredTestimonials.value;
	if (list.length === 0) return cards;

	for (let i = 0; i < Math.min(3, list.length); i++) {
		const index = (currentIndex.value + i) % list.length;
		cards.push(list[index]);
	}
	return cards;
});

const currentTestimonial = computed(
	() =>
		filteredTestimonials.value[currentIndex.value] ||
		filteredTestimonials.value[0],
);

const next = () => {
	const list = filteredTestimonials.value;
	if (list.length === 0) return;
	currentIndex.value = (currentIndex.value + 1) % list.length;
	resetProgress();
};

const prev = () => {
	const list = filteredTestimonials.value;
	if (list.length === 0) return;
	currentIndex.value =
		currentIndex.value === 0 ? list.length - 1 : currentIndex.value - 1;
	resetProgress();
};

const goTo = (index: number) => {
	currentIndex.value = index;
	resetProgress();
};

const selectBranch = (branch: string | null) => {
	selectedBranch.value = branch;
	currentIndex.value = 0;
	resetProgress();
};

// Stories progress bar
const resetProgress = () => {
	progressWidth.value = 0;
};

const startProgress = () => {
	progressIntervalId = setInterval(() => {
		progressWidth.value += 2;
		if (progressWidth.value >= 100) {
			next();
		}
	}, 100);
};

const stopProgress = () => {
	if (progressIntervalId) {
		clearInterval(progressIntervalId);
		progressIntervalId = null;
	}
};

const startAutoPlay = () => {
	intervalId = setInterval(next, 5000);
};

const stopAutoPlay = () => {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
};

// Handle tap on mobile stories
const handleStoryTap = (event: MouseEvent) => {
	const target = event.currentTarget as HTMLElement;
	const rect = target.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const width = rect.width;

	if (x < width / 3) {
		prev();
	} else {
		next();
	}
};

// Get initials from name
const getInitials = (name: string) => {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
};

// Get branch color classes
const getBranchClasses = (branch: string) => {
	return branchColors[branch] || branchColors.Puebla;
};

// Branches for filter
const branches = ['Puebla', 'Roma', 'Lindavista', 'Reyes', 'Cuautitlán'];

onMounted(() => {
	startAutoPlay();
	startProgress();
});

onUnmounted(() => {
	stopAutoPlay();
	stopProgress();
});
</script>

<template>
	<div class="relative">
		<!-- Branch Filter -->
		<div class="flex flex-wrap justify-center gap-2 mb-8">
			<button
				@click="selectBranch(null)"
				:class="[
					'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
					!selectedBranch
						? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
						: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600',
				]"
			>
				Todas
			</button>
			<button
				v-for="branch in branches"
				:key="branch"
				@click="selectBranch(branch)"
				:class="[
					'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
					selectedBranch === branch
						? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
						: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600',
				]"
			>
				{{ branch }}
			</button>
		</div>

		<!-- Mobile Stories View -->
		<div
			class="md:hidden relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#0f2a5c] to-[#1a3a6c]"
			@click="handleStoryTap"
			@mouseenter="
				stopAutoPlay();
				stopProgress();
			"
			@mouseleave="
				startAutoPlay();
				startProgress();
			"
			@touchstart="
				stopAutoPlay();
				stopProgress();
			"
			@touchend="
				startAutoPlay();
				startProgress();
			"
		>
			<!-- Progress bars -->
			<div class="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3">
				<div
					v-for="(_, index) in Math.min(
						6,
						filteredTestimonials.length,
					)"
					:key="index"
					class="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
				>
					<div
						class="h-full bg-white rounded-full transition-all duration-100"
						:style="{
							width:
								index < currentIndex % 6
									? '100%'
									: index === currentIndex % 6
										? `${progressWidth}%`
										: '0%',
						}"
					></div>
				</div>
			</div>

			<!-- Story Content -->
			<div
				class="relative min-h-[400px] p-6 pt-12 flex flex-col justify-between"
			>
				<!-- Source & Branch badges -->
				<div class="flex items-center justify-between mb-6">
					<!-- Source badge -->
					<div
						class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm"
					>
						<span
							v-if="currentTestimonial?.source === 'Google'"
							class="flex items-center gap-1.5"
						>
							<svg class="w-4 h-4" viewBox="0 0 24 24">
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							<span class="text-white text-xs font-medium"
								>Google</span
							>
						</span>
						<span v-else class="flex items-center gap-1.5">
							<svg
								class="w-4 h-4"
								fill="#1877F2"
								viewBox="0 0 24 24"
							>
								<path
									d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
								/>
							</svg>
							<span class="text-white text-xs font-medium"
								>Facebook</span
							>
						</span>
					</div>

					<!-- Branch badge -->
					<div
						class="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm"
					>
						<span class="text-white text-xs font-medium"
							>📍 {{ currentTestimonial?.branch }}</span
						>
					</div>
				</div>

				<!-- Quote icon -->
				<svg
					class="w-10 h-10 text-pink-400 mb-4"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
					/>
				</svg>

				<p class="text-white text-lg leading-relaxed mb-6 flex-1">
					"{{ currentTestimonial?.text }}"
				</p>

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<!-- Avatar with initials -->
						<div
							class="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center"
						>
							<span class="text-white font-bold">{{
								getInitials(currentTestimonial?.name || '')
							}}</span>
						</div>
						<div>
							<p class="font-bold text-white text-lg">
								{{ currentTestimonial?.name }}
							</p>
							<p class="text-white/70 text-sm">
								Sucursal {{ currentTestimonial?.branch }}
							</p>
						</div>
					</div>

					<!-- Rating -->
					<div class="flex gap-0.5">
						<svg
							v-for="i in currentTestimonial?.rating || 5"
							:key="i"
							class="w-5 h-5 text-yellow-400"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
							/>
						</svg>
					</div>
				</div>

				<!-- Navigation hint -->
				<div
					class="absolute top-1/2 -translate-y-1/2 left-4 text-white/50"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</div>
				<div
					class="absolute top-1/2 -translate-y-1/2 right-4 text-white/50"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</div>
			</div>
		</div>

		<!-- Desktop Grid View -->
		<div
			class="hidden md:block"
			@mouseenter="stopAutoPlay"
			@mouseleave="startAutoPlay"
		>
			<div class="grid grid-cols-3 gap-6">
				<div
					v-for="(testimonial, idx) in visibleCards"
					:key="testimonial.id"
					class="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden transition-all duration-500 border-2"
					:class="[
						idx === 1
							? 'md:scale-105 md:z-10 shadow-2xl ring-2 ring-pink-400 ring-offset-2 dark:ring-offset-slate-900 border-pink-200 dark:border-pink-800'
							: 'shadow-lg hover:shadow-xl opacity-90 border-gray-100 dark:border-slate-700',
						getBranchClasses(testimonial.branch).border,
					]"
				>
					<!-- Header with source & branch -->
					<div class="p-5 pb-0">
						<div class="flex items-center justify-between mb-4">
							<!-- Source badge -->
							<div
								:class="[
									'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
									testimonial.source === 'Google'
										? 'bg-blue-50 dark:bg-blue-900/30'
										: 'bg-blue-50 dark:bg-blue-900/30',
								]"
							>
								<span
									v-if="testimonial.source === 'Google'"
									class="flex items-center gap-1.5"
								>
									<svg class="w-4 h-4" viewBox="0 0 24 24">
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
									<span
										class="text-gray-600 dark:text-gray-300 text-xs font-medium"
										>Google</span
									>
								</span>
								<span v-else class="flex items-center gap-1.5">
									<svg
										class="w-4 h-4"
										fill="#1877F2"
										viewBox="0 0 24 24"
									>
										<path
											d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
										/>
									</svg>
									<span
										class="text-gray-600 dark:text-gray-300 text-xs font-medium"
										>Facebook</span
									>
								</span>
							</div>

							<!-- Rating -->
							<div class="flex gap-0.5">
								<svg
									v-for="i in testimonial.rating"
									:key="i"
									class="w-4 h-4 text-yellow-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
							</div>
						</div>

						<!-- Branch badge -->
						<div
							:class="[
								'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
								getBranchClasses(testimonial.branch).bg,
								getBranchClasses(testimonial.branch).text,
							]"
						>
							<svg
								class="w-3 h-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							CETIN {{ testimonial.branch }}
						</div>
					</div>

					<!-- Content -->
					<div class="p-5 pt-4">
						<!-- Quote icon -->
						<svg
							class="w-8 h-8 text-pink-200 dark:text-pink-900 mb-3"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
							/>
						</svg>

						<p
							class="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 mb-4"
						>
							"{{ testimonial.text }}"
						</p>

						<!-- Author -->
						<div
							class="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-slate-700"
						>
							<div
								class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
								:class="getBranchClasses(testimonial.branch).bg"
							>
								<span
									class="font-bold text-sm"
									:class="
										getBranchClasses(testimonial.branch)
											.text
									"
									>{{ getInitials(testimonial.name) }}</span
								>
							</div>
							<div>
								<p
									class="font-semibold text-[#0f2a5c] dark:text-white"
								>
									{{ testimonial.name }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Navigation (Desktop only) -->
			<div class="hidden md:flex items-center justify-center gap-6 mt-10">
				<button
					@click="prev"
					class="w-10 h-10 bg-pink-50 dark:bg-slate-700 border border-pink-200 dark:border-slate-600 rounded-full flex items-center justify-center text-pink-400 dark:text-pink-300 hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all"
					aria-label="Anterior"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<!-- Dots (show max 10) -->
				<div class="flex items-center gap-2">
					<button
						v-for="(_, index) in Math.min(
							10,
							filteredTestimonials.length,
						)"
						:key="index"
						@click="goTo(index)"
						:class="[
							'h-2 rounded-full transition-all duration-300',
							index === currentIndex % 10
								? 'w-8 bg-pink-500'
								: 'w-2 bg-pink-200 dark:bg-slate-600 hover:bg-pink-300 dark:hover:bg-pink-400',
						]"
						:aria-label="`Ir al testimonio ${index + 1}`"
					/>
					<span
						v-if="filteredTestimonials.length > 10"
						class="text-gray-400 text-sm ml-2"
					>
						+{{ filteredTestimonials.length - 10 }} más
					</span>
				</div>

				<button
					@click="next"
					class="w-10 h-10 bg-pink-50 dark:bg-slate-700 border border-pink-200 dark:border-slate-600 rounded-full flex items-center justify-center text-pink-400 dark:text-pink-300 hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all"
					aria-label="Siguiente"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.line-clamp-4 {
	display: -webkit-box;
	-webkit-line-clamp: 4;
	line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
