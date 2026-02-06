export const usePortfolioHead = () => {
    const {t, lang} = useLanguage();
    
    useHead(() => ({
        title: t.value.meta.title,
        htmlAttrs: {
            lang: lang.value,
        },
        meta: [
            {key: 'description', name: 'description', content: t.value.meta.description},
            {key: 'og:title', property: 'og:title', content: t.value.meta.title},
            {key: 'og:description', property: 'og:description', content: t.value.meta.description},
            {key: 'og:type', property: 'og:type', content: 'website'},
            {key: 'og:locale', property: 'og:locale', content: lang.value === 'ru' ? 'ru_RU' : 'en_US'},
            {key: 'og:image', property: 'og:image', content: '/og-image.png'},
            {key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image'},
            {key: 'twitter:title', name: 'twitter:title', content: t.value.meta.title},
            {key: 'twitter:description', name: 'twitter:description', content: t.value.meta.description},
            {key: 'twitter:image', name: 'twitter:image', content: '/og-image.png'},
        ],
    }));
};
