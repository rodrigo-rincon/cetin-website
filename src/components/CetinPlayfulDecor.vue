<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'care' | 'stories' | 'contact' }>(), {
	variant: 'care',
});
</script>

<template>
	<div class="cetin-decor" :class="`cetin-decor--${variant}`" aria-hidden="true">
		<svg class="cetin-decor__arc" viewBox="0 0 180 120" fill="none">
			<path d="M18 104C25 55 51 24 91 24c39 0 66 30 72 80" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
			<path d="M38 104c6-35 24-57 53-57 28 0 47 22 52 57" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity=".55" />
			<path d="M60 104c4-21 14-34 31-34 16 0 27 13 31 34" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity=".28" />
		</svg>

		<svg class="cetin-decor__pulse" viewBox="0 0 220 70" fill="none">
			<path d="M5 39h48l12-18 19 37 20-51 18 32h93" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
		</svg>

		<svg class="cetin-decor__spark cetin-decor__spark--one" viewBox="0 0 48 48" fill="none">
			<path d="M24 5c1.5 12 7 17.5 19 19-12 1.5-17.5 7-19 19-1.5-12-7-17.5-19-19C17 22.5 22.5 17 24 5Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" />
		</svg>
		<svg class="cetin-decor__spark cetin-decor__spark--two" viewBox="0 0 48 48" fill="none">
			<path d="M24 5c1.5 12 7 17.5 19 19-12 1.5-17.5 7-19 19-1.5-12-7-17.5-19-19C17 22.5 22.5 17 24 5Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" />
		</svg>

		<div class="cetin-decor__dots"><i></i><i></i><i></i><i></i><i></i></div>
	</div>
</template>

<style scoped>
.cetin-decor { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
.cetin-decor svg { position: absolute; }
.cetin-decor__arc { right: -2rem; top: 3rem; width: 11rem; color: #60a5fa; opacity: .2; transform: rotate(8deg); animation: cetin-float 8s ease-in-out infinite; }
.cetin-decor__pulse { bottom: 3rem; left: -2rem; width: 13.5rem; color: #ec4899; opacity: .18; animation: cetin-drift 10s ease-in-out infinite; }
.cetin-decor__spark { width: 2.25rem; color: #f59e0b; opacity: .38; animation: cetin-twinkle 5s ease-in-out infinite; }
.cetin-decor__spark--one { left: 7%; top: 12%; }
.cetin-decor__spark--two { right: 15%; bottom: 12%; width: 1.5rem; color: #ec4899; animation-delay: -2.3s; }
.cetin-decor__dots { position: absolute; right: 8%; top: 44%; display: flex; gap: .5rem; transform: rotate(-10deg); }
.cetin-decor__dots i { display: block; width: .48rem; height: .48rem; border-radius: 50%; background: #f59e0b; opacity: .45; }
.cetin-decor__dots i:nth-child(2) { background: #ec4899; transform: translateY(-.35rem); }
.cetin-decor__dots i:nth-child(3) { background: #60a5fa; transform: translateY(-.55rem); }
.cetin-decor__dots i:nth-child(4) { background: #2dd4bf; transform: translateY(-.35rem); }
.cetin-decor__dots i:nth-child(5) { background: #f59e0b; }
.cetin-decor--stories .cetin-decor__arc { left: -3rem; right: auto; top: 5rem; color: #ec4899; transform: rotate(-12deg); }
.cetin-decor--stories .cetin-decor__pulse { right: -2rem; left: auto; color: #60a5fa; }
.cetin-decor--stories .cetin-decor__dots { top: 15%; right: 10%; }
.cetin-decor--contact .cetin-decor__arc { top: auto; right: 2%; bottom: -2rem; color: #2dd4bf; }
.cetin-decor--contact .cetin-decor__pulse { top: 5rem; bottom: auto; color: #f59e0b; }
.cetin-decor--contact .cetin-decor__spark--one { left: 4%; top: 42%; color: #60a5fa; }
:global(.dark) .cetin-decor { filter: saturate(.85) brightness(1.12); }
@keyframes cetin-float { 0%,100% { transform: translate3d(0,0,0) rotate(8deg); } 50% { transform: translate3d(-8px,10px,0) rotate(5deg); } }
@keyframes cetin-drift { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(14px,-6px,0); } }
@keyframes cetin-twinkle { 0%,100% { transform: scale(.9) rotate(0); opacity: .28; } 50% { transform: scale(1.12) rotate(8deg); opacity: .5; } }
@media (max-width: 767px) { .cetin-decor__arc { width: 8rem; opacity: .13; } .cetin-decor__pulse { width: 9rem; opacity: .12; } .cetin-decor__dots { display: none; } }
@media (prefers-reduced-motion: reduce) { .cetin-decor * { animation: none !important; } }
</style>
