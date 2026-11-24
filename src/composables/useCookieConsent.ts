import { computed, ref } from 'vue';

type CookiePreferences = {
	version: 1;
	externalMedia: boolean;
};

const STORAGE_KEY = 'cetin_cookie_preferences';
const preferences = ref<CookiePreferences | null>(null);

const loadPreferences = () => {
	if (preferences.value) return;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return;
		const parsed = JSON.parse(stored) as CookiePreferences;
		if (parsed.version === 1) preferences.value = parsed;
	} catch {
		localStorage.removeItem(STORAGE_KEY);
	}
};

const savePreferences = (externalMedia: boolean) => {
	preferences.value = { version: 1, externalMedia };
	localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences.value));
	window.dispatchEvent(new CustomEvent('cetin-cookie-preferences-updated'));
};

export const useCookieConsent = () => {
	loadPreferences();
	return {
		preferences,
		hasDecision: computed(() => preferences.value !== null),
		externalMediaAllowed: computed(() => preferences.value?.externalMedia === true),
		acceptAll: () => savePreferences(true),
		acceptNecessary: () => savePreferences(false),
		savePreferences,
	};
};
