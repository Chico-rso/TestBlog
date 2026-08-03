import assert from 'node:assert/strict';
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
    assert.equal(getLocaleFromPath('/projects/u2'), 'ru');
    assert.equal(getLocaleFromPath('/en'), 'en');
    assert.equal(getLocaleFromPath('/en/projects/u2'), 'en');
    assert.equal(getLocaleFromPath('/en/projects/u2/?view=full#details'), 'en');
    assert.equal(getLocaleFromPath('/enough'), 'ru');
    assert.equal(getLocaleFromPath('/engineering'), 'ru');
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
