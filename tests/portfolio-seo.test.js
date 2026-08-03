import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

import {buildPortfolioSeo} from '../lib/portfolio/seo.js';

const readSource = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

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
    assert.equal((source.match(/public, max-age=31536000, immutable/g) || []).length, 2);
    assert.match(source, /strict-transport-security[^\n]+max-age=31536000; includeSubDomains/);
    assert.match(source, /x-content-type-options[^\n]+nosniff/);
    assert.match(source, /referrer-policy[^\n]+strict-origin-when-cross-origin/);
    assert.match(source, /permissions-policy[^\n]+camera=\(\), microphone=\(\), geolocation=\(\)/);
    assert.match(source, /content-security-policy-report-only/);
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
    assert.match(source, /setTimeout\([^,]+,\s*3000\)/s);
    assert.match(source, /cancelIdleCallback/);
    assert.match(source, /clearTimeout/);
    assert.match(source, /window\.addEventListener\(['"]pagehide['"],\s*cleanup/);
    assert.match(source, /window\.removeEventListener\(['"]pagehide['"],\s*cleanup/);
    assert.doesNotMatch(source, /app:beforeUnmount/);
    assert.match(source, /https:\/\/mc\.yandex\.ru\/metrika\/tag\.js\?id=\$\{COUNTER_ID\}/);
    assert.match(source, /script\.async = true/);
    assert.match(source, /ssr:\s*true/);
    assert.match(source, /webvisor:\s*true/);
    assert.match(source, /clickmap:\s*true/);
    assert.match(source, /accurateTrackBounce:\s*true/);
    assert.match(source, /trackLinks:\s*true/);
    assert.doesNotMatch(source, /ecommerce/);
});
