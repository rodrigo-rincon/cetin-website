// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');
module.exports = {
	content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
	darkMode: 'class', // Control manual con clase 'dark'
	theme: {
		container: {
			center: true,
			padding: '2rem',
		},
		fontSize: {
			xxs: '.55rem',
			xs: '.75rem',
			sm: '.875rem',
			tiny: '.975rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem',
			'5xl': '3rem',
			'6xl': '4rem',
			'7xl': '5rem',
			header: '3.125rem',
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: '#1a1a1a',
			gray: colors.gray,
			white: colors.white,
			red: colors.red,
			green: colors.green,
			orange: colors.orange,
			blue: colors.blue,
			purple: colors.purple,
			yellow: colors.yellow,
			pink: colors.pink,
			cyan: colors.cyan,
			teal: colors.teal,
			amber: colors.amber,
			slate: colors.slate,
			emerald: colors.emerald,
			// Colores de marca CETIN
			primary: {
				DEFAULT: '#E91E8C', // Rosa principal
				light: '#fce7f3',
				dark: '#be185d',
			},
			secondary: {
				DEFAULT: '#2563eb', // Azul
				light: '#dbeafe',
			},
			accent: {
				yellow: '#FBBF24', // Amarillo
				red: '#EF4444', // Rojo
			},
			tertiary: {
				DEFAULT: '#536288',
			},
			title: {
				DEFAULT: '#0f2f64',
			},
			// Colores secundarios CETIN
			cetin: {
				lavender: '#bd9eca',
				coral: '#ef797b',
				gold: '#fcc009',
				turquoise: '#3bdcd4',
				lime: '#a0ca73',
			},
		},
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
			heading: ['Outfit', 'sans-serif'],
		},
		letterSpacing: {
			1: '0em',
			2: '0.025em',
			3: '0.05em',
			4: '0.1em',
		},
		extend: {
			borderRadius: {
				DEFAULT: '12px',
			},
		},
	},
	variants: {
		extend: {
			cursor: ['disabled', 'hover', 'loading'],
		},
	},
	plugins: [],
};
