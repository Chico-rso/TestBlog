import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

import {buildPortfolioSeo} from '../lib/portfolio/seo.js';

const readSource = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

const createMetrikaHarness = () => {
    const windowListeners = new Map();
    const idleCallbacks = new Map();
    const timeoutCallbacks = new Map();
    const scripts = [];
    const hooks = new Map();
    let nextHandle = 1;
    let removedHookCount = 0;

    const window = {
        location: {href: 'https://amiranbestaev.ru/'},
        addEventListener: (name, callback) => windowListeners.set(name, callback),
        removeEventListener: (name, callback) => {
            if (windowListeners.get(name) === callback) {
                windowListeners.delete(name);
            }
        },
        requestIdleCallback: (callback) => {
            const handle = nextHandle++;
            idleCallbacks.set(handle, callback);
            return handle;
        },
        cancelIdleCallback: (handle) => idleCallbacks.delete(handle),
        setTimeout: (callback) => {
            const handle = nextHandle++;
            timeoutCallbacks.set(handle, callback);
            return handle;
        },
        clearTimeout: (handle) => timeoutCallbacks.delete(handle),
    };
    const document = {
        readyState: 'complete',
        title: 'Homepage',
        referrer: 'https://search.example/',
        scripts,
        querySelector: () => scripts.find((script) => script.dataset.portfolioYandexMetrika),
        createElement: () => {
            const listeners = new Map();
            const script = {
                dataset: {},
                addEventListener: (name, callback) => listeners.set(name, callback),
                removeEventListener: (name, callback) => {
                    if (listeners.get(name) === callback) {
                        listeners.delete(name);
                    }
                },
                remove: () => {
                    const index = scripts.indexOf(script);
                    if (index >= 0) {
                        scripts.splice(index, 1);
                    }
                },
                installYmOnLoad: true,
                dispatch: (name) => {
                    if (name === 'load' && script.installYmOnLoad) {
                        const queuedCalls = window.ym?.a || [];
                        const ym = (...args) => ym.a.push(args);
                        ym.a = queuedCalls;
                        window.ym = ym;
                    }
                    listeners.get(name)?.();
                },
            };
            return script;
        },
        head: {
            append: (script) => scripts.push(script),
        },
    };
    const nuxtApp = {
        hook: (name, callback) => {
            hooks.set(name, callback);
            return () => {
                removedHookCount += 1;
                hooks.delete(name);
            };
        },
    };

    let plugin;
    const source = readSource('../plugins/yandex-metrika.client.js')
        .replace('export default defineNuxtPlugin', 'defineNuxtPlugin')
        .replace(/\s*import\.meta\.hot\?\.dispose\(cleanup\);/, '');
    Function('defineNuxtPlugin', 'window', 'document', source)(
        (callback) => {
            plugin = callback;
            return callback;
        },
        window,
        document,
    );
    plugin(nuxtApp);

    const runFirst = (callbacks) => {
        const [handle, callback] = callbacks.entries().next().value;
        callbacks.delete(handle);
        callback();
    };

    return {
        document,
        hooks,
        idleCallbacks,
        nuxtApp,
        runFirst,
        scripts,
        timeoutCallbacks,
        window,
        windowListeners,
        get removedHookCount() {
            return removedHookCount;
        },
    };
};

test('Russian homepage SEO exposes absolute locale URLs and only Person and WebSite data', () => {
    const seo = buildPortfolioSeo({locale: 'ru', page: 'home'});

    assert.equal(seo.canonical, 'https://amiranbestaev.ru/');
    assert.deepEqual(seo.alternates, {
        ru: 'https://amiranbestaev.ru/',
        en: 'https://amiranbestaev.ru/en',
        xDefault: 'https://amiranbestaev.ru/',
    });
    assert.equal(seo.image, 'https://amiranbestaev.ru/og-image.png');
    assert.deepEqual(seo.jsonLd.map((item) => item['@type']), ['Person', 'WebSite']);
});

test('English U2 SEO exposes equivalent locale routes and only Person and CreativeWork data', () => {
    const seo = buildPortfolioSeo({locale: 'en', page: 'u2'});

    assert.equal(seo.canonical, 'https://amiranbestaev.ru/en/projects/u2');
    assert.deepEqual(seo.alternates, {
        ru: 'https://amiranbestaev.ru/projects/u2',
        en: 'https://amiranbestaev.ru/en/projects/u2',
        xDefault: 'https://amiranbestaev.ru/projects/u2',
    });
    assert.equal(seo.image, 'https://amiranbestaev.ru/projects/u2/u2-home-desktop.webp');
    assert.deepEqual(seo.jsonLd.map((item) => item['@type']), ['Person', 'CreativeWork']);
    assert.equal(seo.jsonLd.some((item) => item['@type'] === 'WebSite'), false);
});

test('all supported pages provide localized metadata and complete truthful structured data', () => {
    for (const locale of ['ru', 'en']) {
        for (const page of ['home', 'u2']) {
            const seo = buildPortfolioSeo({locale, page});
            const person = seo.jsonLd.find((item) => item['@type'] === 'Person');

            assert.ok(seo.title.trim().length > 0);
            assert.ok(seo.description.trim().length > 0);
            assert.equal(seo.ogLocale, locale === 'ru' ? 'ru_RU' : 'en_US');
            assert.doesNotMatch(seo.canonical, /amiranbestaev\.ru\/\//);
            assert.equal(person.name, 'Amiran Bestaev');
            assert.equal(person['@id'], 'https://amiranbestaev.ru/#person');
            assert.equal(person.jobTitle, 'Frontend Engineer');
            assert.deepEqual(person.sameAs, ['https://t.me/AmiranBestaev']);
            assert.deepEqual(person.address, {
                '@type': 'PostalAddress',
                addressLocality: 'Moscow',
                addressCountry: 'Russia',
            });
            assert.equal('worksFor' in person, false);
            assert.equal('aggregateRating' in person, false);
        }
    }

    const ru = buildPortfolioSeo({locale: 'ru', page: 'u2'});
    const en = buildPortfolioSeo({locale: 'en', page: 'u2'});
    const ruWork = ru.jsonLd.find((item) => item['@type'] === 'CreativeWork');
    const enWork = en.jsonLd.find((item) => item['@type'] === 'CreativeWork');

    assert.notEqual(ru.title, en.title);
    assert.notEqual(ru.description, en.description);
    assert.equal(enWork.url, en.canonical);
    assert.equal(enWork.image, en.image);
    assert.equal(enWork.sameAs, 'https://u2.moscow/');
    assert.equal(enWork.inLanguage, 'en');
    assert.equal(enWork.creator.name, 'Amiran Bestaev');
    assert.match(enWork.creator['@id'], /#person$/);
    assert.equal('aggregateRating' in enWork, false);
    assert.notEqual(ruWork.description, enWork.description);
});

test('SEO builder rejects unsupported locale and page values clearly', () => {
    assert.throws(
        () => buildPortfolioSeo({locale: 'de', page: 'home'}),
        /Unsupported locale: de/,
    );
    assert.throws(
        () => buildPortfolioSeo({locale: 'ru', page: 'contact'}),
        /Unsupported page: contact/,
    );
});

test('public sitemap and robots expose exactly the four canonical routes', () => {
    const sitemap = readSource('../public/sitemap.xml');
    const robots = readSource('../public/robots.txt');
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

    assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    assert.deepEqual(locations, [
        'https://amiranbestaev.ru/',
        'https://amiranbestaev.ru/en',
        'https://amiranbestaev.ru/projects/u2',
        'https://amiranbestaev.ru/en/projects/u2',
    ]);
    assert.equal((sitemap.match(/<url>/g) || []).length, 4);
    assert.doesNotMatch(sitemap, /<lastmod>/);
    assert.match(robots, /^User-agent: \*$/m);
    assert.match(robots, /^Allow: \/$/m);
    assert.match(robots, /^Sitemap: https:\/\/amiranbestaev\.ru\/sitemap\.xml$/m);
});

test('Nuxt platform config prerenders public routes and sets cache and report-only security headers', () => {
    const source = readSource('../nuxt.config.ts');
    const packageManifest = JSON.parse(readSource('../package.json'));
    const lockfile = JSON.parse(readSource('../package-lock.json'));

    assert.match(source, /routes:\s*\['\/', '\/en', '\/projects\/u2', '\/en\/projects\/u2'\]/);
    assert.match(source, /['"]\/_nuxt\/\*\*['"]/);
    assert.match(source, /['"]\/fonts\/\*\*['"]/);
    assert.equal((source.match(/public, max-age=31536000, immutable/g) || []).length, 1);
    assert.match(source, /['"]\/fonts\/\*\*['"][\s\S]+public, max-age=86400, must-revalidate/);
    assert.match(source, /['"]\/\*\*['"][\s\S]+public, max-age=0, must-revalidate/);
    assert.match(source, /strict-transport-security[^\n]+max-age=31536000; includeSubDomains/);
    assert.match(source, /x-content-type-options[^\n]+nosniff/);
    assert.match(source, /referrer-policy[^\n]+strict-origin-when-cross-origin/);
    assert.match(source, /permissions-policy[^\n]+camera=\(\), microphone=\(\), geolocation=\(\)/);
    assert.match(source, /content-security-policy-report-only/);
    assert.match(source, /frame-ancestors 'none'/);
    assert.doesNotMatch(source, /['"]content-security-policy['"]\s*:/);
    assert.match(source, /https:\/\/mc\.yandex\.ru/);
    assert.doesNotMatch(source, /key:\s*['"]yandex-metrika/);
    assert.doesNotMatch(source, /noscript\s*:/);
    assert.equal(packageManifest.engines.node, '>=20.10.0');
    assert.equal(lockfile.packages[''].engines.node, '>=20.10.0');
});

test('head integration is page-specific, absolute, alternate-aware, and safely serializes JSON-LD', () => {
    const head = readSource('../composables/usePortfolioHead.js');
    const home = readSource('../components/portfolio/PortfolioHome.vue');
    const u2 = readSource('../components/case/U2CasePage.vue');

    assert.match(home, /usePortfolioHead\('home'\);/);
    assert.match(u2, /usePortfolioHead\('u2'\);/);
    assert.match(head, /buildPortfolioSeo\(\{locale:\s*lang\.value, page\}\)/);
    assert.match(head, /rel:\s*['"]canonical['"]/);
    assert.match(head, /hreflang:\s*['"]ru['"]/);
    assert.match(head, /hreflang:\s*['"]en['"]/);
    assert.match(head, /hreflang:\s*['"]x-default['"]/);
    assert.match(head, /property:\s*['"]og:url['"]/);
    assert.match(head, /property:\s*['"]og:site_name['"]/);
    assert.match(head, /type:\s*['"]application\/ld\+json['"]/);
    assert.ok(head.includes("replaceAll('<', '\\\\u003c')"));
});

test('Yandex Metrika starts after load and idle time without duplicate script or initialization', () => {
    const source = readSource('../plugins/yandex-metrika.client.js');

    assert.match(source, /window\.addEventListener\(['"]load['"]/);
    assert.match(source, /document\.readyState === ['"]complete['"]/);
    assert.match(source, /requestIdleCallback/);
    assert.match(source, /const RETRY_DELAY = 3000;/);
    assert.match(source, /window\.setTimeout\(loadScript, RETRY_DELAY\)/);
    assert.match(source, /cancelIdleCallback/);
    assert.match(source, /clearTimeout/);
    assert.match(source, /window\.addEventListener\(['"]pagehide['"],\s*onPageHide/);
    assert.match(source, /window\.removeEventListener\(['"]pagehide['"],\s*onPageHide/);
    assert.match(source, /window\.addEventListener\(['"]pageshow['"],\s*onPageShow/);
    assert.doesNotMatch(source, /app:beforeUnmount/);
    assert.match(source, /https:\/\/mc\.yandex\.ru\/metrika\/tag\.js\?id=\$\{COUNTER_ID\}/);
    assert.match(source, /script\.async = true/);
    assert.match(source, /ssr:\s*true/);
    assert.match(source, /webvisor:\s*true/);
    assert.match(source, /clickmap:\s*true/);
    assert.match(source, /accurateTrackBounce:\s*true/);
    assert.match(source, /trackLinks:\s*true/);
    assert.match(source, /defer:\s*true/);
    assert.match(source, /nuxtApp\.hook\(['"]page:finish['"]/);
    assert.match(source, /['"]hit['"]/);
    assert.match(source, /lastTrackedUrl/);
    assert.match(source, /removePageFinishHook/);
    assert.doesNotMatch(source, /ecommerce/);
});

test('Yandex Metrika sends one initial hit, deduplicates hydration, and tracks SPA URL changes', () => {
    const harness = createMetrikaHarness();

    assert.equal(harness.idleCallbacks.size, 1);
    assert.equal(harness.hooks.has('page:finish'), true);
    harness.runFirst(harness.idleCallbacks);
    assert.equal(harness.scripts.length, 1);
    harness.scripts[0].dispatch('load');

    assert.deepEqual(harness.window.ym.a[0], [106719755, 'init', {
        ssr: true,
        webvisor: true,
        clickmap: true,
        accurateTrackBounce: true,
        trackLinks: true,
        defer: true,
    }]);
    assert.deepEqual(harness.window.ym.a[1], [106719755, 'hit', 'https://amiranbestaev.ru/', {
        title: 'Homepage',
        referer: 'https://search.example/',
    }]);

    harness.hooks.get('page:finish')();
    assert.equal(harness.window.ym.a.length, 2, 'hydration must not duplicate the initial hit');

    harness.window.location.href = 'https://amiranbestaev.ru/en/projects/u2?view=full#gallery';
    harness.document.title = 'U2 case';
    harness.hooks.get('page:finish')();
    assert.deepEqual(harness.window.ym.a[2], [
        106719755,
        'hit',
        'https://amiranbestaev.ru/en/projects/u2?view=full#gallery',
        {title: 'U2 case', referer: 'https://amiranbestaev.ru/'},
    ]);
    harness.hooks.get('page:finish')();
    assert.equal(harness.window.ym.a.length, 3, 'same URL must stay deduplicated');

    harness.windowListeners.get('pagehide')();
    assert.equal(harness.removedHookCount, 1);
    assert.equal(harness.hooks.has('page:finish'), false);
});

test('Yandex Metrika removes a failed script and recovers once without duplicate initialization', () => {
    const harness = createMetrikaHarness();

    harness.runFirst(harness.idleCallbacks);
    const failedScript = harness.scripts[0];
    failedScript.dispatch('error');
    assert.equal(harness.scripts.length, 0);
    assert.equal(typeof harness.window.ym, 'undefined');
    assert.equal(harness.timeoutCallbacks.size, 1);

    harness.runFirst(harness.timeoutCallbacks);
    assert.equal(harness.scripts.length, 1);
    harness.scripts[0].dispatch('load');
    assert.equal(harness.window.ym.a.filter((call) => call[1] === 'init').length, 1);
    assert.equal(harness.window.ym.a.filter((call) => call[1] === 'hit').length, 1);
});

test('Yandex Metrika reuses an existing matching script instead of loading a duplicate', () => {
    const harness = createMetrikaHarness();
    const existingScript = harness.document.createElement('script');
    existingScript.src = 'https://mc.yandex.ru/metrika/tag.js?id=106719755';
    harness.scripts.push(existingScript);

    harness.runFirst(harness.idleCallbacks);
    assert.equal(harness.scripts.length, 1);
    existingScript.dispatch('load');
    assert.equal(harness.window.ym.a.filter((call) => call[1] === 'init').length, 1);
    assert.equal(harness.window.ym.a.filter((call) => call[1] === 'hit').length, 1);
});

test('Yandex Metrika retries when a loaded script does not install the API', () => {
    const harness = createMetrikaHarness();

    harness.runFirst(harness.idleCallbacks);
    harness.scripts[0].installYmOnLoad = false;
    harness.scripts[0].dispatch('load');
    assert.equal(harness.scripts.length, 0);
    assert.equal(typeof harness.window.ym, 'undefined');
    assert.equal(harness.timeoutCallbacks.size, 1);
});

test('Yandex Metrika restores its route hook after a BFCache page resumes', () => {
    const harness = createMetrikaHarness();

    harness.windowListeners.get('pagehide')({persisted: true});
    assert.equal(harness.hooks.has('page:finish'), false);
    assert.equal(harness.removedHookCount, 1);
    harness.windowListeners.get('pageshow')({persisted: true});
    assert.equal(harness.hooks.has('page:finish'), true);
    assert.equal(harness.windowListeners.has('pagehide'), true);
});
