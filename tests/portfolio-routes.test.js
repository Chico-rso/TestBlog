import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

import {
    getLocaleFromPath,
    getPageKeyFromPath,
    getRouteForLocale,
    portfolioRoutes,
} from '../lib/portfolio/routes.js';

test('exposes the exact frozen locale route table for shared navigation consumers', () => {
    assert.deepEqual(portfolioRoutes, {
        ru: {
            home: '/',
            u2: '/projects/u2',
        },
        en: {
            home: '/en',
            u2: '/en/projects/u2',
        },
    });
    assert.equal(Object.isFrozen(portfolioRoutes), true);
    assert.equal(Object.isFrozen(portfolioRoutes.ru), true);
    assert.equal(Object.isFrozen(portfolioRoutes.en), true);
});

test('derives locale only from the exact English URL prefix', () => {
    assert.equal(getLocaleFromPath('/'), 'ru');
    assert.equal(getLocaleFromPath(null), 'ru');
    assert.equal(getLocaleFromPath(undefined), 'ru');
    assert.equal(getLocaleFromPath(''), 'ru');
    assert.equal(getLocaleFromPath('?preview=full'), 'ru');
    assert.equal(getLocaleFromPath('/projects/u2'), 'ru');
    assert.equal(getLocaleFromPath('/en'), 'en');
    assert.equal(getLocaleFromPath('/en/projects/u2'), 'en');
    assert.equal(getLocaleFromPath('/en/projects/u2/?view=full#details'), 'en');
    assert.equal(getLocaleFromPath('/enough'), 'ru');
    assert.equal(getLocaleFromPath('/engineering'), 'ru');
});

test('makes locale preference persistence best effort before URL navigation', () => {
    const source = readFileSync(new URL('../composables/useLanguage.js', import.meta.url), 'utf8');
    const destination = source.indexOf('const destination = getRouteForLocale(route.path, target);');
    const persistence = source.indexOf("localStorage.setItem('lang', target);");
    const navigation = source.indexOf('return navigateTo(destination);');

    assert.ok(destination >= 0, 'destination is computed before persistence');
    assert.match(source, /try\s*\{\s*localStorage\.setItem\('lang', target\);\s*\}\s*catch\s*\{\s*\}/);
    assert.ok(destination < persistence, 'storage write follows destination computation');
    assert.ok(persistence < navigation, 'navigation still follows the storage write');
    assert.doesNotMatch(source, /localStorage\.getItem/);
});

test('maps a known page to its exact route in the target locale', () => {
    assert.equal(getRouteForLocale('/', 'en'), '/en');
    assert.equal(getRouteForLocale('/en', 'ru'), '/');
    assert.equal(getRouteForLocale('/projects/u2', 'en'), '/en/projects/u2');
    assert.equal(getRouteForLocale('/en/projects/u2', 'ru'), '/projects/u2');
    assert.equal(getRouteForLocale('/en/projects/u2/?preview=1#hero', 'ru'), '/projects/u2');
});

test('uses the home page as the deterministic fallback for unknown public paths', () => {
    assert.equal(getPageKeyFromPath('/'), 'home');
    assert.equal(getPageKeyFromPath('/en/projects/u2'), 'u2');
    assert.equal(getPageKeyFromPath('/engineering'), 'home');
    assert.equal(getRouteForLocale('/engineering', 'en'), '/en');
    assert.equal(getRouteForLocale('/en/unknown', 'ru'), '/');
});

test('rejects unsupported target locales with a clear error', () => {
    assert.throws(
        () => getRouteForLocale('/', 'de'),
        /Unsupported locale: de/,
    );
});
