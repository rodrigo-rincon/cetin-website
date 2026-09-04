<script setup lang="ts">
import { computed, ref } from 'vue';
import { testimonials, type Testimonial } from '../data/testimonials';

const currentIndex = ref(0);
const selectedBranch = ref('');
const expandedTestimonials = ref<Set<number>>(new Set());

const normalizedTestimonials = computed(() =>
	testimonials.map((testimonial) => ({
		...testimonial,
		branch: testimonial.branch.trim(),
	})),
);

const branches = computed(() =>
	Array.from(new Set(normalizedTestimonials.value.map((item) => item.branch))).sort(),
);

const filteredTestimonials = computed(() => {
	if (!selectedBranch.value) return normalizedTestimonials.value;
	return normalizedTestimonials.value.filter(
		(testimonial) => testimonial.branch === selectedBranch.value,
	);
});

const visibleTestimonials = computed(() => {
	const list = filteredTestimonials.value;
	if (!list.length) return [];
	return Array.from({ length: Math.min(3, list.length) }, (_, offset) =>
		list[(currentIndex.value + offset) % list.length],
	);
});

const selectBranch = () => {
	currentIndex.value = 0;
	expandedTestimonials.value = new Set();
};

const next = () => {
	if (!filteredTestimonials.value.length) return;
	currentIndex.value = (currentIndex.value + 1) % filteredTestimonials.value.length;
};

const prev = () => {
	const length = filteredTestimonials.value.length;
	if (!length) return;
	currentIndex.value = currentIndex.value === 0 ? length - 1 : currentIndex.value - 1;
};

const toggleExpanded = (id: number) => {
	const nextSet = new Set(expandedTestimonials.value);
	nextSet.has(id) ? nextSet.delete(id) : nextSet.add(id);
	expandedTestimonials.value = nextSet;
};

const isExpanded = (id: number) => expandedTestimonials.value.has(id);

const getInitials = (name: string) =>
	name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();

const sourceLabel = (testimonial: Testimonial) =>
	`Opinión publicada en ${testimonial.source}`;
</script>

<template>
	<div>
		<div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
			<p class="text-sm text-slate-500 dark:text-slate-400">
				{{ filteredTestimonials.length }} experiencias compartidas
			</p>
			<label class="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
				Sucursal
				<select
					v-model="selectedBranch"
					class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-pink-900/30"
					@change="selectBranch"
				>
					<option value="">Todas</option>
					<option v-for="branch in branches" :key="branch" :value="branch">{{ branch }}</option>
				</select>
			</label>
		</div>

		<Transition name="testimonial" mode="out-in">
			<div :key="`${selectedBranch}-${currentIndex}`" class="grid grid-cols-1 gap-5 md:grid-cols-3">
			<article
				v-for="(testimonial, index) in visibleTestimonials"
				:key="testimonial.id"
				class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-pink-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-pink-800"
				:class="index > 0 ? 'hidden md:flex' : 'flex'"
			>
				<div class="mb-5 flex items-start justify-between gap-4">
					<div>
						<p class="font-semibold text-[#0f2a5c] dark:text-white">CETIN {{ testimonial.branch }}</p>
						<p class="mt-1 text-xs text-slate-500 dark:text-slate-300">{{ sourceLabel(testimonial) }}</p>
					</div>
					<div class="flex shrink-0 gap-0.5" :aria-label="`${testimonial.rating} de 5 estrellas`">
						<svg v-for="star in testimonial.rating" :key="star" class="testimonial-star h-4 w-4" viewBox="0 0 20 20" aria-hidden="true">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					</div>
				</div>

				<p
					class="flex-1 text-[15px] leading-7 text-slate-600 dark:text-slate-300"
					:class="isExpanded(testimonial.id) ? '' : 'line-clamp-5'"
				>
					“{{ testimonial.text }}”
				</p>
				<button
					v-if="testimonial.text.length > 190"
					type="button"
					class="mt-2 self-start text-sm font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-300 dark:hover:text-pink-200"
					@click="toggleExpanded(testimonial.id)"
				>
					{{ isExpanded(testimonial.id) ? 'Ver menos' : 'Leer más' }}
				</button>

				<div class="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-sm font-bold text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">
						{{ getInitials(testimonial.name) }}
					</div>
					<p class="font-medium text-slate-800 dark:text-slate-100">{{ testimonial.name }}</p>
				</div>
			</article>
			</div>
		</Transition>

		<div class="mt-8 flex items-center justify-center gap-4">
			<button type="button" class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-pink-300 hover:text-pink-500 dark:border-slate-700 dark:text-slate-300" aria-label="Testimonios anteriores" @click="prev">←</button>
			<p class="min-w-20 text-center text-sm text-slate-500 dark:text-slate-400">
				{{ filteredTestimonials.length ? currentIndex + 1 : 0 }} / {{ filteredTestimonials.length }}
			</p>
			<button type="button" class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-pink-300 hover:text-pink-500 dark:border-slate-700 dark:text-slate-300" aria-label="Siguientes testimonios" @click="next">→</button>
		</div>
	</div>
</template>

<style scoped>
.testimonial-star {
	color: #fcc009;
	fill: #fcc009;
	filter: drop-shadow(0 1px 1px rgb(15 23 42 / 0.18));
}

:global(.dark) .testimonial-star {
	color: #fde047;
	fill: #fde047;
	filter: drop-shadow(0 0 5px rgb(253 224 71 / 0.22));
}

.testimonial-enter-active,
.testimonial-leave-active {
	transition:
		opacity 280ms ease,
		transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.testimonial-enter-from {
	opacity: 0;
	transform: translateX(18px) scale(0.985);
}

.testimonial-leave-to {
	opacity: 0;
	transform: translateX(-18px) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
	.testimonial-enter-active,
	.testimonial-leave-active {
		transition: none;
	}
}

.line-clamp-5 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 5;
	line-clamp: 5;
	overflow: hidden;
}
</style>
