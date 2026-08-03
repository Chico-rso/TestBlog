const portfolioRoutes = Object.freeze({
    ru: Object.freeze({
        home: '/',
        u2: '/projects/u2',
    }),
    en: Object.freeze({
        home: '/en',
        u2: '/en/projects/u2',
    }),
});

const normalizePath = (path) => {
    const pathname = String(path).split(/[?#]/, 1)[0] || '/';
    const trimmedPath = pathname.replace(/\/+$/, '');

    return trimmedPath || '/';
};

export const getLocaleFromPath = (path) => {
    const normalizedPath = normalizePath(path);

    return normalizedPath === '/en' || normalizedPath.startsWith('/en/') ? 'en' : 'ru';
};

export const getPageKeyFromPath = (path) => {
    const normalizedPath = normalizePath(path);

    if (normalizedPath === '/projects/u2' || normalizedPath === '/en/projects/u2') {
        return 'u2';
    }

    return 'home';
};

export const getRouteForLocale = (path, locale) => {
    if (!Object.hasOwn(portfolioRoutes, locale)) {
        throw new Error(`Unsupported locale: ${locale}`);
    }

    return portfolioRoutes[locale][getPageKeyFromPath(path)];
};
