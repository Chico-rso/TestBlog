import { portfolioCopy } from '~/data/portfolioCopy.js';
import { getLocaleFromPath, getRouteForLocale } from '~/lib/portfolio/routes.js';

export const useLanguage = () => {
    const route = useRoute();
    const lang = computed(() => getLocaleFromPath(route.path));
    const t = computed(() => portfolioCopy[lang.value]);

    const toggleLang = () => {
        const target = lang.value === 'ru' ? 'en' : 'ru';

        if (process.client) {
            localStorage.setItem('lang', target);
        }

        return navigateTo(getRouteForLocale(route.path, target));
    };

    return {lang, t, toggleLang};
};
