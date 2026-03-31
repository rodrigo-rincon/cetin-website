import testimonialsData from './testimonials.json';

export interface Testimonial {
	id: number;
	name: string;
	text: string;
	branch: string;
	source: 'Google' | 'Facebook';
	rating: number;
}

export const testimonials: Testimonial[] = testimonialsData as Testimonial[];

export const branchColors: Record<
	string,
	{ bg: string; text: string; border: string }
> = {
	Puebla: {
		bg: 'bg-pink-100 dark:bg-pink-900/30',
		text: 'text-pink-600 dark:text-pink-400',
		border: 'border-pink-200 dark:border-pink-800',
	},
	Roma: {
		bg: 'bg-blue-100 dark:bg-blue-900/30',
		text: 'text-blue-600 dark:text-blue-400',
		border: 'border-blue-200 dark:border-blue-800',
	},
	Lindavista: {
		bg: 'bg-emerald-100 dark:bg-emerald-900/30',
		text: 'text-emerald-600 dark:text-emerald-400',
		border: 'border-emerald-200 dark:border-emerald-800',
	},
	Reyes: {
		bg: 'bg-purple-100 dark:bg-purple-900/30',
		text: 'text-purple-600 dark:text-purple-400',
		border: 'border-purple-200 dark:border-purple-800',
	},
	Cuautitlán: {
		bg: 'bg-orange-100 dark:bg-orange-900/30',
		text: 'text-orange-600 dark:text-orange-400',
		border: 'border-orange-200 dark:border-orange-800',
	},
};

export const branches = [
	'Puebla',
	'Roma',
	'Lindavista',
	'Reyes',
	'Cuautitlán',
] as const;
