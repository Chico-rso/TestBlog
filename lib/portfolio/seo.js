import {portfolioCopy} from '../../data/portfolioCopy.js';
import {portfolioConfig} from '../../data/portfolioConfig.js';
import {portfolioRoutes} from './routes.js';

const supportedLocales = Object.freeze(['ru', 'en']);
const supportedPages = Object.freeze(['home', 'u2']);

const absoluteUrl = (path) => new URL(path, `${portfolioConfig.siteUrl}/`).href;

const buildPerson = (locale) => {
    const homeUrl = absoluteUrl(portfolioRoutes[locale].home);

    return {
        '@context': 'https://schema.org',
        '@id': `${homeUrl}#person`,
        '@type': 'Person',
        name: 'Amiran Bestaev',
        jobTitle: 'Frontend Engineer',
        url: homeUrl,
        sameAs: [`https://t.me/${portfolioConfig.telegram}`],
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Moscow',
            addressCountry: 'Russia',
        },
    };
};

const buildWebsite = (locale, title) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    url: absoluteUrl(portfolioRoutes[locale].home),
    inLanguage: locale,
});

const getU2Project = (locale) => {
    const project = portfolioCopy[locale].projects.find(({id}) => id === 'u2');

    if (!project?.case) {
        throw new Error(`Missing U2 case data for locale: ${locale}`);
    }

    return project;
};

const getPageMetadata = (locale, page) => {
    if (page === 'home') {
        return {
            title: portfolioCopy[locale].meta.title,
            description: portfolioCopy[locale].meta.description,
            imagePath: '/og-image.png',
        };
    }

    const project = getU2Project(locale);

    return {
        title: `${project.name} — ${project.type} | Amiran Bestaev`,
        description: project.case.summary,
        imagePath: project.teaserMedia.webp,
        project,
    };
};

export const buildPortfolioSeo = ({locale, page}) => {
    if (!supportedLocales.includes(locale)) {
        throw new Error(`Unsupported locale: ${locale}`);
    }
    if (!supportedPages.includes(page)) {
        throw new Error(`Unsupported page: ${page}`);
    }

    const metadata = getPageMetadata(locale, page);
    const canonical = absoluteUrl(portfolioRoutes[locale][page]);
    const alternates = {
        ru: absoluteUrl(portfolioRoutes.ru[page]),
        en: absoluteUrl(portfolioRoutes.en[page]),
        xDefault: absoluteUrl(portfolioRoutes.ru[page]),
    };
    const image = absoluteUrl(metadata.imagePath);
    const person = buildPerson(locale);
    const jsonLd = [person];

    if (page === 'home') {
        jsonLd.push(buildWebsite(locale, metadata.title));
    } else {
        jsonLd.push({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: `${metadata.project.name} — ${metadata.project.type}`,
            description: metadata.description,
            url: canonical,
            image,
            inLanguage: locale,
            creator: {
                '@id': person['@id'],
                name: person.name,
            },
            sameAs: 'https://u2.moscow/',
        });
    }

    return {
        title: metadata.title,
        description: metadata.description,
        canonical,
        alternates,
        image,
        ogLocale: locale === 'ru' ? 'ru_RU' : 'en_US',
        jsonLd,
    };
};
