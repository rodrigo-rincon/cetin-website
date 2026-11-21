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

const deckTestimonials = computed(() => {
	const list = filteredTestimonials.value;
	if (!list.length) return [];
	if (list.length === 1) return [{ testimonial: list[0], position: 'active' as const }];
	if (list.length === 2) {
		return [
			{ testimonial: list[currentIndex.value], position: 'active' as const },
			{ testimonial: list[(currentIndex.value + 1) % list.length], position: 'next' as const },
		];
	}
	return [
		{ testimonial: list[(currentIndex.value - 1 + list.length) % list.length], position: 'previous' as const },
		{ testimonial: list[currentIndex.value], position: 'active' as const },
		{ testimonial: list[(currentIndex.value + 1) % list.length], position: 'next' as const },
	];
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

const showTestimonial = (position: 'previous' | 'active' | 'next') => {
	if (position === 'previous') prev();
	if (position === 'next') next();
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
					class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-pink-400 dark:focus:ring-pink-400/20"
					@change="selectBranch"
				>
					<option value="">Todas</option>
					<option v-for="branch in branches" :key="branch" :value="branch">{{ branch }}</option>
				</select>
			</label>
		</div>

		<div class="testimonial-deck-stage">
			<div class="testimonial-deck">
					<article
						v-for="item in deckTestimonials"
						:key="item.testimonial.id"
						class="testimonial-deck-card"
						:class="`testimonial-deck-card-${item.position}`"
						:aria-hidden="item.position !== 'active'"
						@click="showTestimonial(item.position)"
					>
						<span v-if="item.position !== 'active'" class="testimonial-side-label">
							{{ item.position === 'previous' ? '← Anterior' : 'Siguiente →' }}
						</span>
						<div class="mb-6 flex items-start justify-between gap-4">
							<div>
								<p class="font-semibold text-[#0f2a5c] dark:text-white">CETIN {{ item.testimonial.branch }}</p>
								<p class="mt-1 text-xs text-slate-500 dark:text-slate-300">{{ sourceLabel(item.testimonial) }}</p>
							</div>
							<div class="flex shrink-0 gap-0.5" :aria-label="`${item.testimonial.rating} de 5 estrellas`">
								<svg v-for="star in item.testimonial.rating" :key="star" class="testimonial-star h-4 w-4" viewBox="0 0 20 20" aria-hidden="true">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							</div>
						</div>

						<p class="testimonial-quote" :class="isExpanded(item.testimonial.id) ? '' : 'line-clamp-7'">“{{ item.testimonial.text }}”</p>
						<button
							v-if="item.position === 'active' && item.testimonial.text.length > 240"
							type="button"
							class="mt-3 self-start text-sm font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-300 dark:hover:text-pink-200"
							@click.stop="toggleExpanded(item.testimonial.id)"
						>
							{{ isExpanded(item.testimonial.id) ? 'Ver menos' : 'Leer más' }}
						</button>

						<div class="mt-auto flex items-center gap-3 border-t border-slate-100 pt-5 dark:border-slate-700">
							<div class="flex h-11 w-11 items-center justify-center rounded-full bg-pink-50 text-sm font-bold text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">{{ getInitials(item.testimonial.name) }}</div>
							<div>
								<p class="font-medium text-slate-800 dark:text-slate-100">{{ item.testimonial.name }}</p>
								<p v-if="item.position === 'active'" class="mt-0.5 text-xs text-slate-400">Experiencia verificada</p>
							</div>
						</div>
					</article>
			</div>
		</div>

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

.testimonial-deck-stage {
	position: relative;
	height: 31rem;
}

.testimonial-deck {
	position: relative;
	height: 100%;
}

.testimonial-deck-card {
	position: absolute;
	top: 0;
	left: 50%;
	display: flex;
	width: min(46rem, calc(100% - 7rem));
	min-height: 27rem;
	flex-direction: column;
	border: 1px solid rgb(226 232 240);
	border-radius: 1.25rem;
	background: white;
	padding: 2.25rem;
	box-shadow: 0 20px 50px rgb(15 23 42 / 0.09);
	transform-origin: center bottom;
	transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease, border-color 180ms ease;
}

.testimonial-deck-card-active {
	z-index: 3;
	transform: translateX(-50%);
}

.testimonial-deck-card-previous {
	z-index: 1;
	cursor: pointer;
	opacity: 0.62;
	transform: translateX(-80%) translateY(1.5rem) rotate(-3deg) scale(0.9);
}

.testimonial-deck-card-next {
	z-index: 2;
	cursor: pointer;
	opacity: 0.72;
	transform: translateX(-20%) translateY(1.5rem) rotate(3deg) scale(0.9);
}

.testimonial-deck-card-previous:hover {
	opacity: 0.8;
	transform: translateX(-79%) translateY(1.25rem) rotate(-3.5deg) scale(0.91);
}

.testimonial-deck-card-next:hover {
	opacity: 0.86;
	transform: translateX(-21%) translateY(1.25rem) rotate(3.5deg) scale(0.91);
}

.testimonial-side-label {
	position: absolute;
	top: -2.25rem;
	font-size: 0.8rem;
	font-weight: 600;
	color: rgb(100 116 139);
}

.testimonial-deck-card-previous .testimonial-side-label { left: 1rem; }
.testimonial-deck-card-next .testimonial-side-label { right: 1rem; }
:global(.dark .testimonial-side-label) { color: rgb(148 163 184); }

.testimonial-deck-card:not(.testimonial-deck-card-active) .testimonial-quote {
	-webkit-line-clamp: 4;
	line-clamp: 4;
}

:global(.dark .testimonial-deck-card) {
	border-color: rgb(51 65 85);
	background: rgb(30 41 59) !important;
	box-shadow: 0 22px 52px rgb(2 6 23 / 0.24);
}

.testimonial-quote {
	margin-bottom: 2rem;
	font-size: clamp(1.125rem, 2vw, 1.4rem);
	line-height: 1.7;
	color: rgb(71 85 105);
}

:global(.dark .testimonial-quote) { color: rgb(203 213 225); }

@media (max-width: 640px) {
	.testimonial-deck-stage { height: 34rem; }
	.testimonial-deck-card { width: calc(100% - 2.5rem); min-height: 30rem; padding: 1.5rem; }
	.testimonial-deck-card-previous { transform: translateX(-55%) translateY(1rem) rotate(-1.5deg) scale(0.96); }
	.testimonial-deck-card-next { transform: translateX(-45%) translateY(1rem) rotate(1.5deg) scale(0.96); }
	.testimonial-side-label { display: none; }
	.testimonial-quote { font-size: 1rem; line-height: 1.65; }
}

@media (prefers-reduced-motion: reduce) {
	.testimonial-deck-card { transition: none; }
}

.line-clamp-7 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 7;
	line-clamp: 7;
	overflow: hidden;
}
</style>
