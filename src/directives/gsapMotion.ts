import type { Directive, DirectiveBinding } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type GsapRevealOptions = {
	alternate?: boolean;
	children?: string;
	delay?: number;
	duration?: number;
	ease?: string;
	rotation?: number;
	scale?: number;
	start?: string;
	stagger?: number;
	x?: number;
	y?: number;
};

const activeTweens = new WeakMap<HTMLElement, gsap.core.Tween>();

const reveal = (el: HTMLElement, binding: DirectiveBinding<GsapRevealOptions | undefined>) => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const options = binding.value ?? {};
	const targets = options.children
		? Array.from(el.querySelectorAll<HTMLElement>(options.children))
		: [el];

	if (!targets.length) return;

	gsap.set(targets, {
		autoAlpha: 0,
		rotation: (index: number) => {
			const rotation = options.rotation ?? 0;
			return options.alternate && index % 2 === 0 ? -rotation : rotation;
		},
		scale: options.scale ?? 1,
		x: (index: number) => {
			const x = options.x ?? 0;
			return options.alternate && index % 2 === 0 ? -x : x;
		},
		y: options.y ?? 20,
	});

	const tween = gsap.to(targets, {
		autoAlpha: 1,
		rotation: 0,
		scale: 1,
		x: 0,
		y: 0,
		delay: options.delay ?? 0,
		duration: options.duration ?? 0.68,
		ease: options.ease ?? 'power2.out',
		stagger: options.stagger ?? 0,
		clearProps: 'opacity,visibility,transform',
		scrollTrigger: {
			trigger: el,
			start: options.start ?? 'top 88%',
			once: true,
		},
	});

	activeTweens.set(el, tween);
};

export const vGsapReveal: Directive<HTMLElement, GsapRevealOptions | undefined> = {
	mounted(el, binding) {
		reveal(el, binding);
	},
	unmounted(el) {
		const tween = activeTweens.get(el);
		tween?.scrollTrigger?.kill();
		tween?.kill();
		activeTweens.delete(el);
	},
};
