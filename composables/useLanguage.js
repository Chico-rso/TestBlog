import { portfolioCopy } from '~/data/portfolioCopy.js';
import { getLocaleFromPath, getRouteForLocale } from '~/lib/portfolio/routes.js';

export const useLanguage = () => {
    const route = useRoute();
    const lang = computed(() => getLocaleFromPath(route.path));
    const t = computed(() => portfolioCopy[lang.value]);

    const toggleLang = () => {
        const target = lang.value === 'ru' ? 'en' : 'ru';
        const destination = getRouteForLocale(route.path, target);

        if (process.client) {
            try {
                localStorage.setItem('lang', target);
            } catch {
            }
        }

        return navigateTo(destination);
    };

    return {lang, t, toggleLang};
};
