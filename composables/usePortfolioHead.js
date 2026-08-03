import {buildPortfolioSeo} from '~/lib/portfolio/seo.js';

const serializeJsonLd = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

export const usePortfolioHead = (page) => {
    const {lang} = useLanguage();

    useHead(() => {
        const seo = buildPortfolioSeo({locale: lang.value, page});
        const ogType = page === 'u2' ? 'article' : 'website';

        return {
            title: seo.title,
            htmlAttrs: {
                lang: lang.value,
            },
            meta: [
                {key: 'description', name: 'description', content: seo.description},
                {key: 'og:title', property: 'og:title', content: seo.title},
                {key: 'og:description', property: 'og:description', content: seo.description},
                {key: 'og:type', property: 'og:type', content: ogType},
                {key: 'og:url', property: 'og:url', content: seo.canonical},
                {key: 'og:locale', property: 'og:locale', content: seo.ogLocale},
                {key: 'og:image', property: 'og:image', content: seo.image},
                {key: 'og:site_name', property: 'og:site_name', content: 'Amiran Bestaev'},
                {key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image'},
                {key: 'twitter:title', name: 'twitter:title', content: seo.title},
                {key: 'twitter:description', name: 'twitter:description', content: seo.description},
                {key: 'twitter:image', name: 'twitter:image', content: seo.image},
            ],
            link: [
                {key: 'canonical', rel: 'canonical', href: seo.canonical},
                {key: 'alternate-ru', rel: 'alternate', hreflang: 'ru', href: seo.alternates.ru},
                {key: 'alternate-en', rel: 'alternate', hreflang: 'en', href: seo.alternates.en},
                {key: 'alternate-default', rel: 'alternate', hreflang: 'x-default', href: seo.alternates.xDefault},
            ],
            script: seo.jsonLd.map((item) => ({
                key: `portfolio-jsonld-${item['@type'].toLowerCase()}`,
                type: 'application/ld+json',
                innerHTML: serializeJsonLd(item),
            })),
        };
    });
};
