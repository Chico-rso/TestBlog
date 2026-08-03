# Portfolio Conversion and U2 Case Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio homepage around Amiran Bestaev's employment-focused positioning, make U2 the single flagship case with real optimized screenshots, and ship URL-based RU/EN routes with stronger performance, SEO, accessibility, and motion fallbacks.

**Architecture:** Keep the existing Nuxt 3 application and Terminal Grid visual system. Move route-independent homepage and case composition into shared components, make the URL the source of truth for locale through pure route helpers, and extend the existing localized JSON plus validator for featured-case data. Generate public evidence assets with deterministic Playwright and Sharp scripts, keep GSAP progressively enhanced, and centralize SEO metadata in pure tested helpers consumed by a Nuxt head composable.

**Tech Stack:** Nuxt 3, Vue 3 `<script setup>`, JavaScript/TypeScript types, SCSS, GSAP/ScrollTrigger, Node test runner, Playwright, Sharp, Python fontTools, Lighthouse.

---

## File map and ownership boundaries

**Shared data and pure logic**

- Modify: `types/portfolio.ts`
- Modify: `data/portfolio/ru.json`
- Modify: `data/portfolio/en.json`
- Modify: `data/portfolioConfig.js`
- Modify: `lib/portfolio/validate.js`
- Create: `lib/portfolio/routes.js`
- Create: `lib/portfolio/seo.js`

**Homepage and global navigation**

- Create: `components/portfolio/PortfolioHome.vue`
- Modify: `pages/index.vue`
- Create: `pages/en/index.vue`
- Modify: `components/sections/HeroSection.vue`
- Create: `components/sections/FeaturedCaseSection.vue`
- Create: `components/sections/CareerSection.vue`
- Modify: `components/sections/WorkSection.vue`
- Modify: `components/sections/SkillsSection.vue`
- Modify: `components/sections/PrinciplesSection.vue`
- Remove from homepage only: `components/sections/AboutSection.vue`
- Remove from homepage only: `components/sections/ExperienceSection.vue`
- Modify: `components/Header.vue`
- Modify: `components/Footer.vue`
- Modify: `components/CommandPalette.vue`
- Modify: `composables/useActiveSection.js`
- Modify: `composables/useLanguage.js`

**U2 case**

- Create: `components/case/U2CasePage.vue`
- Create: `components/case/CaseHero.vue`
- Create: `components/case/CaseFacts.vue`
- Create: `components/case/CaseNarrative.vue`
- Create: `components/case/CaseGallery.vue`
- Create: `components/case/CaseResult.vue`
- Create: `components/case/CaseNavigation.vue`
- Create: `pages/projects/u2.vue`
- Create: `pages/en/projects/u2.vue`

**Assets, presentation, motion, and platform**

- Create: `scripts/capture-u2-assets.mjs`
- Create: `scripts/optimize-u2-assets.mjs`
- Create: `scripts/convert-fonts.py`
- Create: `public/projects/u2/*.{avif,webp}`
- Create: `assets/fonts/Montserrat/Montserrat-VariableFont_wght.woff2`
- Create: `assets/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.woff2`
- Modify: `assets/scss/base/fonts.scss`
- Modify: `assets/scss/portfolio.scss`
- Modify: `composables/usePortfolioAnimations.js`
- Modify: `composables/usePortfolioHead.js`
- Create: `plugins/yandex-metrika.client.js`
- Modify: `nuxt.config.ts`
- Modify: `public/robots.txt`
- Create: `public/sitemap.xml`

**Verification**

- Modify: `tests/portfolio-data.test.js`
- Create: `tests/portfolio-routes.test.js`
- Create: `tests/portfolio-seo.test.js`
- Create: `tests/portfolio-assets.test.js`
- Modify: `tests/portfolio-ui.spec.js`
- Modify: `playwright.config.js`
- Modify: `package.json`
- Modify: `package-lock.json`

## Execution preflight

- [ ] Use `superpowers:using-git-worktrees` to create an isolated worktree on branch `codex/portfolio-u2-case` from the confirmed `main` commit containing `b0bc0d5 add portfolio conversion spec`.
- [ ] In that worktree run `npm test && npm run build` before editing. Expected: the current baseline tests pass and the current Nuxt production build exits 0. If the baseline fails, stop and diagnose it before attributing failures to this plan.
- [ ] Keep `.superpowers/`, `output/`, source PNG captures, Lighthouse reports, Playwright screenshots, and local server artifacts untracked.

## Task 1: Capture and optimize real U2 evidence assets

**Files:**

- Create: `tests/portfolio-assets.test.js`
- Create: `scripts/capture-u2-assets.mjs`
- Create: `scripts/optimize-u2-assets.mjs`
- Create: `public/projects/u2/u2-home-desktop.{avif,webp}`
- Create: `public/projects/u2/u2-filters-desktop.{avif,webp}`
- Create: `public/projects/u2/u2-flat-desktop.{avif,webp}`
- Create: `public/projects/u2/u2-filters-mobile.{avif,webp}`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Add the failing asset contract test**

Create `tests/portfolio-assets.test.js`:

```js
import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import test from 'node:test';

const assets = [
    'u2-home-desktop',
    'u2-filters-desktop',
    'u2-flat-desktop',
    'u2-filters-mobile',
];

test('U2 evidence images exist as non-empty AVIF and WebP files', () => {
    for (const name of assets) {
        for (const extension of ['avif', 'webp']) {
            const url = new URL(`../public/projects/u2/${ name }.${ extension }`, import.meta.url);
            assert.ok(statSync(url).size > 10_000, `${ name }.${ extension } must be optimized evidence, not a stub`);
        }
    }
});

test('generated images have the expected file signatures', () => {
    const avif = readFileSync(new URL('../public/projects/u2/u2-home-desktop.avif', import.meta.url));
    const webp = readFileSync(new URL('../public/projects/u2/u2-home-desktop.webp', import.meta.url));
    assert.equal(avif.subarray(4, 12).toString('ascii'), 'ftypavif');
    assert.equal(webp.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(webp.subarray(8, 12).toString('ascii'), 'WEBP');
});
```

- [ ] **Step 2: Run the test and verify it fails because the assets do not exist**

Run: `node --experimental-default-type=module --test tests/portfolio-assets.test.js`

Expected: FAIL with `ENOENT` for `public/projects/u2/u2-home-desktop.avif`.

- [ ] **Step 3: Install the deterministic image optimizer**

Run: `npm install --save-dev sharp`

Expected: `sharp` appears in `devDependencies` and `package-lock.json` changes.

- [ ] **Step 4: Add the capture script**

Create `scripts/capture-u2-assets.mjs` with four fixed public views:

```js
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const output = new URL('../output/u2-source/', import.meta.url);
await mkdir(output, {recursive: true});

const browser = await chromium.launch({headless: true});
const targets = [
    {name: 'u2-home-desktop', url: 'https://u2.moscow/', viewport: {width: 1600, height: 1000}},
    {name: 'u2-filters-desktop', url: 'https://u2.moscow/flats', viewport: {width: 1600, height: 1000}},
    {name: 'u2-flat-desktop', url: 'https://u2.moscow/flats/453', viewport: {width: 1600, height: 1000}},
    {name: 'u2-filters-mobile', url: 'https://u2.moscow/flats', viewport: {width: 390, height: 844}, deviceScaleFactor: 2},
];

try {
    for (const target of targets) {
        const context = await browser.newContext({
            viewport: target.viewport,
            deviceScaleFactor: target.deviceScaleFactor ?? 1,
            colorScheme: 'light',
            locale: 'ru-RU',
        });
        const page = await context.newPage();
        await page.goto(target.url, {waitUntil: 'domcontentloaded', timeout: 60_000});
        await page.waitForTimeout(4_000);
        const consent = page.getByRole('button', {name: /принять|согласен|accept/i}).first();
        if (await consent.isVisible().catch(() => false)) {
            await consent.click();
        }
        await page.screenshot({path: new URL(`${ target.name }.png`, output).pathname});
        await context.close();
    }
} finally {
    await browser.close();
}
```

- [ ] **Step 5: Add the optimizer and package command**

Create `scripts/optimize-u2-assets.mjs`:

```js
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const source = new URL('../output/u2-source/', import.meta.url);
const destination = new URL('../public/projects/u2/', import.meta.url);
await mkdir(destination, {recursive: true});

const names = [
    'u2-home-desktop',
    'u2-filters-desktop',
    'u2-flat-desktop',
    'u2-filters-mobile',
];

for (const name of names) {
    const input = new URL(`${ name }.png`, source);
    await sharp(fileURLToPath(input))
        .avif({quality: 64, effort: 6})
        .toFile(fileURLToPath(new URL(`${ name }.avif`, destination)));
    await sharp(fileURLToPath(input))
        .webp({quality: 76, effort: 6})
        .toFile(fileURLToPath(new URL(`${ name }.webp`, destination)));
}
```

Add to `package.json`:

```json
"assets:u2": "node scripts/capture-u2-assets.mjs && node scripts/optimize-u2-assets.mjs",
"test": "node --experimental-default-type=module --test tests/*.test.js"
```

- [ ] **Step 6: Generate and visually inspect the evidence**

Run: `npm run assets:u2`

Expected: eight optimized files are created in `public/projects/u2/`. Open all four WebP files and reject any frame with a cookie overlay, blank loading state, broken layout, or private user data. Recapture only the affected public route after correcting the deterministic wait/consent behavior.

- [ ] **Step 7: Run the asset test and commit**

Run: `node --experimental-default-type=module --test tests/portfolio-assets.test.js`

Expected: 2 tests PASS.

Run:

```bash
git add package.json package-lock.json scripts/capture-u2-assets.mjs scripts/optimize-u2-assets.mjs tests/portfolio-assets.test.js public/projects/u2
git commit -m "add u2 case assets"
```

## Task 2: Extend the localized data contract for a single featured U2 case

**Files:**

- Modify: `types/portfolio.ts`
- Modify: `data/portfolio/ru.json`
- Modify: `data/portfolio/en.json`
- Modify: `lib/portfolio/validate.js`
- Modify: `tests/portfolio-data.test.js`

- [ ] **Step 1: Add failing data-contract tests**

Append these tests to `tests/portfolio-data.test.js`:

```js
test('U2 is the only featured project and has localized case evidence', () => {
    const copy = loadCopy();

    for (const [locale, data] of Object.entries(copy)) {
        const featured = data.projects.filter((project) => project.featured);
        assert.equal(featured.length, 1, `${ locale } must have one featured project`);
        assert.equal(featured[0].id, 'u2');
        assert.equal(featured[0].casePath, locale === 'ru' ? '/projects/u2' : '/en/projects/u2');
        assert.equal(featured[0].case.gallery.length, 4);
        assert.equal(featured[0].case.facts.length, 4);
        assert.equal(featured[0].case.narrative.length, 4);
        featured[0].case.gallery.forEach((media) => {
            assert.ok(media.avif.startsWith('/projects/u2/'));
            assert.ok(media.webp.startsWith('/projects/u2/'));
            assert.ok(media.alt.length > 0);
            assert.ok(media.width > 0);
            assert.ok(media.height > 0);
        });
    }

    assert.doesNotThrow(() => validatePortfolioCopy(copy));
});

test('validator rejects more than one featured project', () => {
    const copy = loadCopy();
    copy.ru.projects[0].featured = true;
    assert.throws(() => validatePortfolioCopy(copy), /ru must contain exactly one featured project/);
});

test('validator rejects missing localized U2 case content', () => {
    const copy = loadCopy();
    copy.en.projects.find((project) => project.id === 'u2').case.narrative = [];
    assert.throws(() => validatePortfolioCopy(copy), /en\.projects\[1\]\.case\.narrative must be non-empty/);
});
```

- [ ] **Step 2: Run the test and verify the new assertions fail**

Run: `npm test`

Expected: FAIL because `featured`, `casePath`, and `case` are absent.

- [ ] **Step 3: Define the explicit TypeScript data shapes**

Add these types to `types/portfolio.ts` and reference them from `PortfolioProject`:

```ts
export type PortfolioMedia = {
    avif: string;
    webp: string;
    alt: string;
    width: number;
    height: number;
};

export type PortfolioCaseFact = {
    label: string;
    value: string;
};

export type PortfolioCaseNarrative = {
    id: 'task' | 'contribution' | 'approach' | 'result';
    title: string;
    text: string;
};

export type PortfolioCase = {
    eyebrow: string;
    summary: string;
    facts: PortfolioCaseFact[];
    narrative: PortfolioCaseNarrative[];
    gallery: PortfolioMedia[];
    technologies: string[];
    result: string;
    backLabel: string;
    externalLabel: string;
    nextLabel: string;
};
```

Extend `PortfolioProject`:

```ts
featured: boolean;
casePath?: string;
teaserMedia?: PortfolioMedia;
case?: PortfolioCase;
```

Replace `PortfolioNav` keys with `experience`, `u2`, `projects`, `stack`, and `contact`. Replace `PortfolioSections` keys with `featured`, `experience`, `projects`, `skills`, and `principles`. Keep the existing `PortfolioHero` property names so the component migration stays incremental.

- [ ] **Step 4: Add exact shared project flags**

In both locale files set `"featured": true` on U2 and `"featured": false` on every other project. Add `casePath` and `teaserMedia` to U2:

```json
"casePath": "/projects/u2",
"teaserMedia": {
  "avif": "/projects/u2/u2-home-desktop.avif",
  "webp": "/projects/u2/u2-home-desktop.webp",
  "alt": "Главная страница жилого комплекса ЮТУ",
  "width": 1600,
  "height": 1000
}
```

Use `"casePath": "/en/projects/u2"` and English alt `"U2 residential project homepage"` in `en.json`.

- [ ] **Step 5: Add the localized U2 case narrative without invented metrics**

Add this `case` object to Russian U2:

```json
"case": {
  "eyebrow": "Флагманский кейс",
  "summary": "Цифровая витрина жилого комплекса с подбором квартир, фильтрами и детальными сценариями выбора недвижимости.",
  "facts": [
    {"label": "Роль", "value": "Frontend Engineer"},
    {"label": "Фокус", "value": "Каталог, фильтры, карточка квартиры"},
    {"label": "Стек", "value": "Nuxt · Vue · TypeScript · GSAP"},
    {"label": "Статус", "value": "В продакшене"}
  ],
  "narrative": [
    {"id": "task", "title": "Задача", "text": "Собрать насыщенную продуктовую витрину недвижимости и связать презентационный контент с понятным сценарием подбора квартиры."},
    {"id": "contribution", "title": "Мой вклад", "text": "Разрабатывал главную страницу и сложные секции, фильтры недвижимости, детальную страницу объекта, генплан и анимационные сценарии интерфейса."},
    {"id": "approach", "title": "Технический подход", "text": "Компонентная архитектура на Vue и Nuxt, типизированная логика фильтрации, управляемые GSAP-анимации и отдельная работа над производительностью тяжёлых визуальных секций."},
    {"id": "result", "title": "Результат", "text": "Работающий продуктовый путь от знакомства с проектом до фильтрации и изучения конкретной квартиры, доступный на публичном сайте."}
  ],
  "gallery": [
    {"avif": "/projects/u2/u2-home-desktop.avif", "webp": "/projects/u2/u2-home-desktop.webp", "alt": "Главная презентационная страница ЮТУ", "width": 1600, "height": 1000},
    {"avif": "/projects/u2/u2-filters-desktop.avif", "webp": "/projects/u2/u2-filters-desktop.webp", "alt": "Каталог квартир ЮТУ с фильтрами", "width": 1600, "height": 1000},
    {"avif": "/projects/u2/u2-flat-desktop.avif", "webp": "/projects/u2/u2-flat-desktop.webp", "alt": "Детальная страница квартиры ЮТУ", "width": 1600, "height": 1000},
    {"avif": "/projects/u2/u2-filters-mobile.avif", "webp": "/projects/u2/u2-filters-mobile.webp", "alt": "Мобильный каталог и фильтры квартир ЮТУ", "width": 780, "height": 1688}
  ],
  "technologies": ["Vue", "Nuxt", "TypeScript", "GSAP", "SCSS", "SSR"],
  "result": "Публичный интерфейс объединяет презентацию проекта, каталог, фильтрацию и детальный просмотр недвижимости без неподтверждённых числовых заявлений.",
  "backLabel": "На главную",
  "externalLabel": "Открыть ЮТУ",
  "nextLabel": "Следующий проект: Новая"
}
```

Add this exact `case` object to English U2:

```json
"case": {
  "eyebrow": "Flagship case",
  "summary": "A digital residential showcase with apartment discovery, filters, and detailed property-selection flows.",
  "facts": [
    {"label": "Role", "value": "Frontend Engineer"},
    {"label": "Focus", "value": "Catalog, filters, apartment detail"},
    {"label": "Stack", "value": "Nuxt · Vue · TypeScript · GSAP"},
    {"label": "Status", "value": "In production"}
  ],
  "narrative": [
    {"id": "task", "title": "Task", "text": "Build a content-rich residential product showcase and connect its presentation layer to a clear apartment-selection journey."},
    {"id": "contribution", "title": "My contribution", "text": "I developed the homepage and complex content sections, property filters, apartment detail page, masterplan, and animated interface scenarios."},
    {"id": "approach", "title": "Technical approach", "text": "A component architecture with Vue and Nuxt, typed filtering logic, controlled GSAP animation, and focused performance work for visually heavy sections."},
    {"id": "result", "title": "Result", "text": "A working product journey from project discovery to filtering and reviewing a specific apartment, available on the public website."}
  ],
  "gallery": [
    {"avif": "/projects/u2/u2-home-desktop.avif", "webp": "/projects/u2/u2-home-desktop.webp", "alt": "U2 primary presentation page", "width": 1600, "height": 1000},
    {"avif": "/projects/u2/u2-filters-desktop.avif", "webp": "/projects/u2/u2-filters-desktop.webp", "alt": "U2 apartment catalog and filters", "width": 1600, "height": 1000},
    {"avif": "/projects/u2/u2-flat-desktop.avif", "webp": "/projects/u2/u2-flat-desktop.webp", "alt": "U2 apartment detail page", "width": 1600, "height": 1000},
    {"avif": "/projects/u2/u2-filters-mobile.avif", "webp": "/projects/u2/u2-filters-mobile.webp", "alt": "U2 mobile apartment catalog and filters", "width": 780, "height": 1688}
  ],
  "technologies": ["Vue", "Nuxt", "TypeScript", "GSAP", "SCSS", "SSR"],
  "result": "The public interface connects project presentation, catalog browsing, filtering, and apartment detail without unsupported numerical claims.",
  "backLabel": "Back home",
  "externalLabel": "Open U2",
  "nextLabel": "Next project: Novaya"
}
```

- [ ] **Step 6: Update navigation, hero proof, and section copy in both locale files**

Set the visible hero role to exactly `Frontend Engineer`. Use three CTA labels in this order: View U2, Download CV, Contact (Russian: `Смотреть U2`, `Скачать CV`, `Связаться`). Change the proof strip to `5+`, `Vue 2/3 · Nuxt 2/3`, and `2` product companies. Replace the navigation and section keys with the type contract from Step 3, and use localized titles for U2 case, career experience, other projects, stack, principles, and contact.

- [ ] **Step 7: Extend the validator**

In `lib/portfolio/validate.js` add `assertBoolean`, `assertPositiveNumber`, and `validateMedia`. Validate every `featured` field, exactly one featured item per locale, U2 as that item, localized `casePath`, non-empty four-item facts/narrative/gallery arrays, allowed narrative IDs, media paths under `/projects/u2/`, positive dimensions, and RU/EN project order parity. Keep the existing duplicate ID and URL checks.

- [ ] **Step 8: Run tests and commit**

Run: `npm test`

Expected: all data and asset tests PASS.

Run:

```bash
git add types/portfolio.ts data/portfolio/ru.json data/portfolio/en.json lib/portfolio/validate.js tests/portfolio-data.test.js
git commit -m "add featured u2 case data"
```

## Task 3: Make locale routing pure, URL-authoritative, and reusable

**Files:**

- Create: `lib/portfolio/routes.js`
- Create: `tests/portfolio-routes.test.js`
- Modify: `composables/useLanguage.js`
- Create: `components/portfolio/PortfolioHome.vue`
- Modify: `pages/index.vue`
- Create: `pages/en/index.vue`

- [ ] **Step 1: Write the failing route tests**

Create `tests/portfolio-routes.test.js`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';

import {getLocaleFromPath, getPageKeyFromPath, getRouteForLocale} from '../lib/portfolio/routes.js';

test('URL selects locale and page without local-storage overrides', () => {
    assert.equal(getLocaleFromPath('/'), 'ru');
    assert.equal(getLocaleFromPath('/projects/u2'), 'ru');
    assert.equal(getLocaleFromPath('/en'), 'en');
    assert.equal(getLocaleFromPath('/en/projects/u2'), 'en');
});

test('locale switch preserves the equivalent public page', () => {
    assert.equal(getRouteForLocale('/', 'en'), '/en');
    assert.equal(getRouteForLocale('/en', 'ru'), '/');
    assert.equal(getRouteForLocale('/projects/u2', 'en'), '/en/projects/u2');
    assert.equal(getRouteForLocale('/en/projects/u2', 'ru'), '/projects/u2');
});

test('route helper distinguishes home and U2 case', () => {
    assert.equal(getPageKeyFromPath('/'), 'home');
    assert.equal(getPageKeyFromPath('/en/projects/u2'), 'u2');
});
```

- [ ] **Step 2: Verify the tests fail because the module is missing**

Run: `node --experimental-default-type=module --test tests/portfolio-routes.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement the pure route table**

Create `lib/portfolio/routes.js`:

```js
export const portfolioRoutes = Object.freeze({
    ru: Object.freeze({home: '/', u2: '/projects/u2'}),
    en: Object.freeze({home: '/en', u2: '/en/projects/u2'}),
});

const normalizedPath = (path) => {
    const value = String(path || '/').split(/[?#]/, 1)[0];
    return value.length > 1 ? value.replace(/\/+$/, '') : '/';
};

export const getLocaleFromPath = (path) => normalizedPath(path) === '/en'
    || normalizedPath(path).startsWith('/en/') ? 'en' : 'ru';

export const getPageKeyFromPath = (path) => normalizedPath(path).endsWith('/projects/u2') ? 'u2' : 'home';

export const getRouteForLocale = (path, locale) => portfolioRoutes[locale][getPageKeyFromPath(path)];
```

- [ ] **Step 4: Refactor `useLanguage` around `useRoute()`**

Replace mutable language state with a computed locale from `route.path`. Keep `t` computed from `portfolioCopy`. Implement `toggleLang` as navigation to `getRouteForLocale(route.path, targetLocale)` and save the target only as a preference; never read it to override a current route.

Core implementation:

```js
const route = useRoute();
const lang = computed(() => getLocaleFromPath(route.path));
const t = computed(() => portfolioCopy[lang.value]);

const toggleLang = async () => {
    const target = lang.value === 'ru' ? 'en' : 'ru';
    if (process.client) localStorage.setItem('lang', target);
    return navigateTo(getRouteForLocale(route.path, target));
};
```

- [ ] **Step 5: Introduce one shared homepage composition**

Move the current page root/ref/head/animation responsibilities to `components/portfolio/PortfolioHome.vue`. For now preserve the existing section composition; Task 4 will replace it. Make both route files thin:

```vue
<!-- pages/index.vue and pages/en/index.vue -->
<template>
    <PortfolioHome/>
</template>
```

- [ ] **Step 6: Run route and full unit tests, then commit**

The wildcard `test` script was established in Task 1, so this run includes data, asset, and route suites.

Run: `npm test`

Expected: all tests PASS.

Run:

```bash
git add lib/portfolio/routes.js tests/portfolio-routes.test.js composables/useLanguage.js components/portfolio/PortfolioHome.vue pages/index.vue pages/en/index.vue package.json
git commit -m "add url locale routes"
```

## Task 4: Recompose the homepage around employment proof and one flagship case

**Files:**

- Modify: `components/portfolio/PortfolioHome.vue`
- Modify: `components/sections/HeroSection.vue`
- Create: `components/sections/FeaturedCaseSection.vue`
- Create: `components/sections/CareerSection.vue`
- Modify: `components/sections/WorkSection.vue`
- Modify: `components/sections/SkillsSection.vue`
- Modify: `components/sections/PrinciplesSection.vue`
- Modify: `tests/portfolio-data.test.js`

- [ ] **Step 1: Replace the old source-level homepage test with failing composition tests**

In `tests/portfolio-data.test.js`, remove the old `work cards render contributions...` test and add:

```js
test('homepage composition prioritizes U2, career, and six other projects', () => {
    const home = readFileSync(new URL('../components/portfolio/PortfolioHome.vue', import.meta.url), 'utf8');
    const work = readFileSync(new URL('../components/sections/WorkSection.vue', import.meta.url), 'utf8');
    assert.match(home, /<FeaturedCaseSection/);
    assert.match(home, /<CareerSection/);
    assert.match(home, /<WorkSection/);
    assert.doesNotMatch(home, /<AboutSection|<ExperienceSection/);
    assert.match(work, /!project\.featured/);
});

test('hero renders personal identity and all three approved calls to action', () => {
    const source = readFileSync(new URL('../components/sections/HeroSection.vue', import.meta.url), 'utf8');
    assert.match(source, /copy\.hero\.name/);
    assert.match(source, /copy\.hero\.role/);
    assert.match(source, /featuredProject\.casePath/);
    assert.match(source, /resumeUrl/);
    assert.match(source, /#contact/);
});
```

- [ ] **Step 2: Run the tests and verify they fail on the old composition**

Run: `npm test`

Expected: FAIL because the featured and career components do not exist and the old approach/profile sections remain.

- [ ] **Step 3: Build the personal hero**

Refactor `HeroSection.vue` to accept `copy` and `featuredProject`; derive the featured U2 project in the parent. Render, in order:

1. no more than two boot lines;
2. `copy.hero.name` as the largest identity line;
3. `copy.hero.role` exactly `Frontend Engineer`;
4. concise subtitle, location, and availability;
5. internal U2 `<NuxtLink>`, CV download, and `#contact` link;
6. proof cards from `copy.stats`.

Do not set inline opacity/transform styles. Keep the decorative visual `aria-hidden="true"`, keep the existing Terminal Grid rings/signals, add stable selectors `data-hero-identity` and `data-hero-role`, and put `data-hero-cta` on each of the three CTA links for browser tests.

- [ ] **Step 4: Build the U2 flagship teaser**

Create `FeaturedCaseSection.vue` with props `{project, section}`. Render a `<picture>` using AVIF then WebP, explicit width/height, `fetchpriority="high"` only for the homepage teaser, internal `NuxtLink` to `project.casePath`, external product link with `target="_blank" rel="noreferrer"`, contribution list, and tags. Add `data-featured-case="u2"`.

- [ ] **Step 5: Render the real career timeline**

Create `CareerSection.vue` with props `{items, section}`. Render semantic `<ol>` entries with company heading, role, period, stack, and every existing bullet. Use `id="experience"` and `data-career-entry`; do not alter IdaProject/O2 dates or claims.

- [ ] **Step 6: Convert the old project section to six compact cards**

In `WorkSection.vue`, compute `projects = copy.projects.filter((project) => !project.featured)`. Rename the section id to `projects`, keep the project ID key and contribution list, and use compact tags plus one external link. Preserve `data-project-card` for motion/tests. The component must not render U2 or duplicate any URL.

- [ ] **Step 7: Condense stack and principles**

Keep all existing truthful skill groups but reduce introductory copy and vertical spacing. Keep principles as static scan-friendly cards, not an accordion. Do not render the former `AboutSection` or `ExperienceSection` on the homepage.

- [ ] **Step 8: Compose the approved order**

Set `PortfolioHome.vue` to this exact order:

```vue
<HeroSection :copy="t" :featured-project="featuredProject"/>
<FeaturedCaseSection id="u2" :project="featuredProject" :section="t.sections.featured"/>
<CareerSection id="experience" :items="t.experience" :section="t.sections.experience"/>
<WorkSection id="projects" :copy="t"/>
<SkillsSection id="stack" :copy="t"/>
<PrinciplesSection id="principles" :copy="t"/>
```

Use `const featuredProject = computed(() => t.value.projects.find(({featured}) => featured));`, retain the page root ref, and keep `usePortfolioAnimations(root)`.

- [ ] **Step 9: Run tests and commit**

Run: `npm test`

Expected: all unit/source tests PASS.

Run:

```bash
git add components/portfolio/PortfolioHome.vue components/sections/HeroSection.vue components/sections/FeaturedCaseSection.vue components/sections/CareerSection.vue components/sections/WorkSection.vue components/sections/SkillsSection.vue components/sections/PrinciplesSection.vue tests/portfolio-data.test.js
git commit -m "rebuild portfolio homepage"
```

## Task 5: Make global navigation route-aware and keyboard-safe

**Files:**

- Modify: `components/Header.vue`
- Modify: `components/Footer.vue`
- Modify: `components/CommandPalette.vue`
- Modify: `composables/useActiveSection.js`
- Modify: `tests/portfolio-data.test.js`

- [ ] **Step 1: Add a failing route-aware navigation source test**

Append:

```js
test('global navigation uses route-aware home links and approved section ids', () => {
    const header = readFileSync(new URL('../components/Header.vue', import.meta.url), 'utf8');
    const palette = readFileSync(new URL('../components/CommandPalette.vue', import.meta.url), 'utf8');
    for (const source of [header, palette]) {
        assert.match(source, /portfolioRoutes/);
        for (const id of ['experience', 'u2', 'projects', 'stack', 'contact']) {
            assert.match(source, new RegExp(id));
        }
    }
});
```

- [ ] **Step 2: Verify it fails**

Run: `npm test`

Expected: FAIL because navigation still uses profile/approach/work and does not import the public route table.

- [ ] **Step 3: Update desktop and mobile header navigation**

Build nav items from `t.nav` with IDs `experience`, `u2`, `projects`, `stack`, and `contact`. Build `homePath` with `portfolioRoutes[lang.value].home`. On the homepage, section links are `${homePath}#${id}` and may smooth-scroll after preventing default. On the U2 case, leave them as real route links so navigation works without client JavaScript. Make the brand a `<NuxtLink :to="homePath">`.

Keep dialog semantics, Escape close, body scroll lock, command trigger, theme, Telegram, and focus-visible styles. After opening the mobile dialog, focus its close control; after closing it, return focus to the burger button.

- [ ] **Step 4: Update command palette and footer**

Make palette commands use the same route-aware URL list. Use real `<NuxtLink>` elements rather than imperative DOM lookup on case routes, while preserving keyboard shortcut and Escape handling. Update footer copy to `t.footer` only so it no longer depends on `systemSections`; keep the contact section ID.

- [ ] **Step 5: Run tests and commit**

Run: `npm test`

Expected: all tests PASS.

Run:

```bash
git add components/Header.vue components/Footer.vue components/CommandPalette.vue composables/useActiveSection.js tests/portfolio-data.test.js
git commit -m "update portfolio navigation"
```

## Task 6: Build the localized U2 case page from shared components

**Files:**

- Create: `components/case/U2CasePage.vue`
- Create: `components/case/CaseHero.vue`
- Create: `components/case/CaseFacts.vue`
- Create: `components/case/CaseNarrative.vue`
- Create: `components/case/CaseGallery.vue`
- Create: `components/case/CaseResult.vue`
- Create: `components/case/CaseNavigation.vue`
- Create: `pages/projects/u2.vue`
- Create: `pages/en/projects/u2.vue`
- Modify: `tests/portfolio-data.test.js`

- [ ] **Step 1: Add a failing case composition test**

Append:

```js
test('U2 case page composes all approved evidence sections', () => {
    const source = readFileSync(new URL('../components/case/U2CasePage.vue', import.meta.url), 'utf8');
    for (const component of ['CaseHero', 'CaseFacts', 'CaseNarrative', 'CaseGallery', 'CaseResult', 'CaseNavigation']) {
        assert.match(source, new RegExp(`<${ component }`));
    }
});
```

- [ ] **Step 2: Verify it fails because the case page does not exist**

Run: `npm test`

Expected: FAIL with `ENOENT` for `U2CasePage.vue`.

- [ ] **Step 3: Build small presentational case components**

Implement these prop-only responsibilities:

- `CaseHero`: project name, eyebrow, summary, external link, hero `<picture>` with explicit dimensions and `fetchpriority="high"`.
- `CaseFacts`: semantic definition list from four facts.
- `CaseNarrative`: four ordered article blocks keyed by narrative ID.
- `CaseGallery`: responsive `<picture>` figures, AVIF/WebP sources, explicit dimensions, lazy loading below the first item, and a sibling `.case-media__fallback` revealed by an image `error` handler without removing the caption.
- `CaseResult`: result text and technology tags.
- `CaseNavigation`: localized home link, public U2 link, and external Novaya link `https://novaya.ru/`.

Every component receives its localized object via props and must not call `useLanguage()` or import JSON internally.

- [ ] **Step 4: Compose the shared case page**

In `U2CasePage.vue`, use `useLanguage()` only to find the U2 project and pass `project.case` down. Add a root ref and call `usePortfolioAnimations(root)` so `.reveal` sections enhance progressively. If U2 or case data is missing, throw `createError({statusCode: 404})`; validation should prevent this in normal builds.

- [ ] **Step 5: Add the two public route wrappers**

Both `pages/projects/u2.vue` and `pages/en/projects/u2.vue` contain only:

```vue
<template>
    <U2CasePage/>
</template>
```

The route path, not the wrapper's client state, determines locale through Task 3.

- [ ] **Step 6: Run tests and commit**

Run: `npm test`

Expected: all tests PASS.

Run:

```bash
git add components/case pages/projects/u2.vue pages/en/projects/u2.vue tests/portfolio-data.test.js
git commit -m "add u2 case pages"
```

## Task 7: Apply the Terminal Grid Evolution layout, responsive rules, and progressive motion

**Files:**

- Modify: `assets/scss/portfolio.scss`
- Modify: `composables/usePortfolioAnimations.js`
- Create: `scripts/convert-fonts.py`
- Create: `assets/fonts/Montserrat/Montserrat-VariableFont_wght.woff2`
- Create: `assets/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.woff2`
- Modify: `assets/scss/base/fonts.scss`
- Modify: `nuxt.config.ts`
- Modify: `tests/portfolio-data.test.js`

- [ ] **Step 1: Add failing font and progressive-motion source tests**

Append:

```js
test('portfolio uses only variable WOFF2 Montserrat files with swap', () => {
    const fonts = readFileSync(new URL('../assets/scss/base/fonts.scss', import.meta.url), 'utf8');
    assert.equal((fonts.match(/@font-face/g) || []).length, 2);
    assert.match(fonts, /Montserrat-VariableFont_wght\.woff2/);
    assert.match(fonts, /Montserrat-Italic-VariableFont_wght\.woff2/);
    assert.match(fonts, /font-display:\s*swap/);
    assert.doesNotMatch(fonts, /\.ttf/);
});

test('animation setup is progressive and defers ScrollTrigger', () => {
    const source = readFileSync(new URL('../composables/usePortfolioAnimations.js', import.meta.url), 'utf8');
    assert.match(source, /requestIdleCallback/);
    assert.match(source, /prefers-reduced-motion: reduce/);
    assert.match(source, /\(hover: hover\) and \(pointer: fine\)/);
    assert.match(source, /catch/);
    assert.doesNotMatch(source, /set\([^)]*,\s*\{[^}]*opacity:\s*0/s);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test`

Expected: FAIL because ten TTF faces remain and ScrollTrigger initializes immediately.

- [ ] **Step 3: Convert the bundled variable fonts**

Create `scripts/convert-fonts.py`:

```python
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1] / "assets/fonts/Montserrat"
for source in ("Montserrat-VariableFont_wght.ttf", "Montserrat-Italic-VariableFont_wght.ttf"):
    font = TTFont(root / source)
    font.flavor = "woff2"
    font.save(root / source.replace(".ttf", ".woff2"))
```

Run: `python3 scripts/convert-fonts.py`

Replace `fonts.scss` with two variable `@font-face` rules, both `font-weight: 100 900`, normal/italic styles, and `font-display: swap`. Add only the upright WOFF2 preload to `nuxt.config.ts` with `rel="preload"`, `as="font"`, `type="font/woff2"`, and `crossorigin="anonymous"`.

- [ ] **Step 4: Rework responsive layout without changing the identity**

In `portfolio.scss` retain existing color variables, blue grid, mono labels, light/dark themes, focus styles, and decorative rings. Add styles for featured case, career timeline, compact projects, and case-page components.

At the mobile breakpoint:

- use `min-height: auto` and compact hero padding;
- hide or reduce the decorative hero visual and boot sequence;
- set `overflow-wrap: anywhere` on long status/copy;
- keep the three CTA controls in the initial 390×844 viewport;
- use one-column featured/case/gallery layouts;
- prevent horizontal overflow with `min-width: 0` on grid children;
- reserve image aspect ratios from the data dimensions.

At tablet/desktop, use asymmetric grid columns for the U2 teaser and case hero, dense two/three-column project cards, and subtle border/spotlight layering. Do not add scroll-jacking or layout-property animation.

- [ ] **Step 5: Make animation enhancement failure-safe**

Keep all content initially visible in CSS and markup. Wrap dynamic GSAP/ScrollTrigger imports and setup in `try/catch`; on failure return without modifying content. Complete hero entrance in about one second. Import ScrollTrigger inside an idle callback only when `.reveal` elements exist. Keep fine-pointer-only parallax, card tilt, pointer glow, and magnetic CTA; use opacity/translate reveals only on coarse pointers. Cancel the idle callback and remove every event listener on unmount.

- [ ] **Step 6: Run unit tests and build, then commit**

Run: `npm test && npm run build`

Expected: all tests PASS and Nuxt build exits 0.

Run:

```bash
git add assets/fonts/Montserrat/*.woff2 assets/scss/base/fonts.scss assets/scss/portfolio.scss scripts/convert-fonts.py composables/usePortfolioAnimations.js nuxt.config.ts tests/portfolio-data.test.js
git commit -m "refine responsive portfolio motion"
```

## Task 8: Add tested canonical SEO, structured data, sitemap, headers, prerendering, and deferred analytics

**Files:**

- Modify: `data/portfolioConfig.js`
- Create: `lib/portfolio/seo.js`
- Create: `tests/portfolio-seo.test.js`
- Modify: `composables/usePortfolioHead.js`
- Modify: `components/portfolio/PortfolioHome.vue`
- Modify: `components/case/U2CasePage.vue`
- Create: `plugins/yandex-metrika.client.js`
- Modify: `nuxt.config.ts`
- Modify: `public/robots.txt`
- Create: `public/sitemap.xml`

- [ ] **Step 1: Write failing pure SEO tests**

Create `tests/portfolio-seo.test.js`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';

import {buildPortfolioSeo} from '../lib/portfolio/seo.js';

test('homepage SEO has absolute canonical, alternates, Person, and WebSite data', () => {
    const seo = buildPortfolioSeo({locale: 'ru', page: 'home'});
    assert.equal(seo.canonical, 'https://amiranbestaev.ru/');
    assert.equal(seo.alternates.en, 'https://amiranbestaev.ru/en');
    assert.equal(seo.alternates.xDefault, 'https://amiranbestaev.ru/');
    assert.deepEqual(seo.jsonLd.map((item) => item['@type']), ['Person', 'WebSite']);
});

test('U2 SEO has equivalent locale routes and CreativeWork data', () => {
    const seo = buildPortfolioSeo({locale: 'en', page: 'u2'});
    assert.equal(seo.canonical, 'https://amiranbestaev.ru/en/projects/u2');
    assert.equal(seo.alternates.ru, 'https://amiranbestaev.ru/projects/u2');
    assert.ok(seo.jsonLd.some((item) => item['@type'] === 'CreativeWork'));
    assert.equal(seo.image, 'https://amiranbestaev.ru/projects/u2/u2-home-desktop.webp');
});
```

- [ ] **Step 2: Verify the test fails because the helper is missing**

Run: `node --experimental-default-type=module --test tests/portfolio-seo.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement deterministic SEO output**

Add `siteUrl: 'https://amiranbestaev.ru'` to `portfolioConfig.js`. In `lib/portfolio/seo.js`, combine `portfolioRoutes`, `siteUrl`, and a fixed page metadata table. Return absolute canonical/alternate/image URLs and:

- `Person` on all four pages with name, job title, URL, Telegram, and location;
- `WebSite` on `/` and `/en`;
- `CreativeWork` on both U2 routes with U2 URL, creator reference, description, and screenshot image.

Do not emit review ratings, employer claims, or numerical outcomes.

- [ ] **Step 4: Wire page-specific head output**

Change `usePortfolioHead(page)` to call the pure helper, set localized title/description/html lang, absolute `og:url`, image and Twitter fields, canonical, RU/EN/x-default links, and JSON-LD scripts using stable keys. Call it with `home` from `PortfolioHome.vue` and `u2` from `U2CasePage.vue`.

- [ ] **Step 5: Defer Yandex Metrika safely**

Remove the inline Metrika script and noscript image from `nuxt.config.ts`. Create `plugins/yandex-metrika.client.js` that waits for `window.load`, then schedules initialization with `requestIdleCallback`; use `setTimeout(..., 3000)` when unavailable. Add the remote script once, initialize counter `106719755` on load, and swallow network/script errors without surfacing UI or console errors from application code.

- [ ] **Step 6: Add route prerendering, caching, and conservative headers**

In `nuxt.config.ts` add:

```ts
nitro: {
    prerender: {routes: ['/', '/en', '/projects/u2', '/en/projects/u2']},
},
routeRules: {
    '/_nuxt/**': {headers: {'cache-control': 'public, max-age=31536000, immutable'}},
    '/**': {headers: {
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'permissions-policy': 'camera=(), microphone=(), geolocation=()',
        'content-security-policy-report-only': "default-src 'self'; script-src 'self' 'unsafe-inline' https://mc.yandex.ru; connect-src 'self' https://mc.yandex.ru https://mc.yandex.com; img-src 'self' data: https://mc.yandex.ru https://mc.yandex.com; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' mailto: https://t.me",
    }},
},
```

Keep CSP report-only, not enforcing.

- [ ] **Step 7: Add the four-route sitemap and robots reference**

Create `public/sitemap.xml` with exactly `/`, `/en`, `/projects/u2`, and `/en/projects/u2`, all using absolute HTTPS URLs. Add `Sitemap: https://amiranbestaev.ru/sitemap.xml` to `public/robots.txt` while retaining `User-agent: *` and `Allow: /`.

- [ ] **Step 8: Run tests/build and inspect generated HTML**

Run: `npm test && npm run build`

Expected: all tests PASS; build exits 0 and prerenders all four routes.

Run: `rg -n "canonical|hreflang|CreativeWork|Frontend Engineer" .output/public/index.html .output/public/en/index.html .output/public/projects/u2/index.html .output/public/en/projects/u2/index.html`

Expected: canonical/hreflang appear on every route, `CreativeWork` appears only on U2 pages, and visible hero/case content is in prerendered HTML.

Run:

```bash
git add data/portfolioConfig.js lib/portfolio/seo.js tests/portfolio-seo.test.js composables/usePortfolioHead.js components/portfolio/PortfolioHome.vue components/case/U2CasePage.vue plugins/yandex-metrika.client.js nuxt.config.ts public/robots.txt public/sitemap.xml
git commit -m "add portfolio seo infrastructure"
```

## Task 9: Replace the old UI test with end-to-end acceptance coverage

**Files:**

- Modify: `tests/portfolio-ui.spec.js`
- Modify: `playwright.config.js`

- [ ] **Step 1: Rewrite the failing desktop/mobile route tests**

Cover these assertions in `tests/portfolio-ui.spec.js` before adjusting any remaining UI bugs:

```js
test('RU homepage prioritizes identity, U2, career, and six other projects', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('[data-hero-identity]')).toContainText('Амиран Бестаев');
    await expect(page.locator('[data-hero-role]')).toHaveText('Frontend Engineer');
    await expect(page.locator('[data-hero-cta]')).toHaveCount(3);
    await expect(page.locator('[data-featured-case="u2"]')).toHaveCount(1);
    await expect(page.locator('[data-project-card]')).toHaveCount(6);
    await expect(page.locator('[data-project-card]').getByText('U2', {exact: true})).toHaveCount(0);
    await expect(page.locator('[data-career-entry]')).toHaveCount(2);
    await expect(page.getByText('IdaProject', {exact: true})).toBeVisible();
    await expect(page.getByText('O2', {exact: true})).toBeVisible();
});

test('language switch preserves equivalent home and case routes', async ({page}) => {
    await page.goto('/');
    await page.locator('button.lang-toggle:visible').click();
    await expect(page).toHaveURL(/\/en$/);
    await page.getByRole('link', {name: /view u2/i}).first().click();
    await expect(page).toHaveURL(/\/en\/projects\/u2$/);
    await page.locator('button.lang-toggle:visible').click();
    await expect(page).toHaveURL(/\/projects\/u2$/);
});

test('U2 case shows real gallery and safe navigation', async ({page}) => {
    await page.goto('/projects/u2');
    await expect(page.getByRole('heading', {name: 'U2'})).toBeVisible();
    await expect(page.locator('[data-case-fact]')).toHaveCount(4);
    await expect(page.locator('[data-case-narrative]')).toHaveCount(4);
    await expect(page.locator('[data-case-media]')).toHaveCount(4);
    await expect(page.locator('a[href="https://novaya.ru/"]')).toBeVisible();
});
```

- [ ] **Step 2: Add explicit 390×844 and no-JavaScript acceptance**

Add a `mobile-390` Playwright project with `{viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}`. On that project assert no horizontal overflow, every hero CTA bounding box ends above `844`, and name/role/subtitle are visible. Add a no-JavaScript describe with `test.use({javaScriptEnabled: false})` that loads `/` and `/projects/u2` and asserts the personal identity, U2 heading, career, and case narrative are visible from SSR HTML.

- [ ] **Step 3: Add interaction/fallback/accessibility regressions**

Add tests for:

- mobile menu opens as a dialog, receives focus, closes with Escape, and restores burger focus;
- command palette opens with `Meta+K` and navigates to a route-aware section;
- dark theme persists through navigation;
- reduced motion keeps all cards visible and without tilt;
- aborting `**/projects/u2/**` images reveals `.case-media__fallback` while captions and layout remain;
- console errors array stays empty, with Yandex routes fulfilled as empty success responses;
- font resource transfer from `performance.getEntriesByType('resource')` totals less than 250,000 bytes when transfer sizes are available.

- [ ] **Step 4: Run tests and fix only observed acceptance failures**

Run: `npx playwright test`

Expected: all desktop, Pixel 7, and 390×844 tests PASS. If a failure exposes a product bug, first record the exact failing assertion, make the smallest component/SCSS fix, rerun that named test, then rerun the full suite.

- [ ] **Step 5: Save approved screenshots and commit**

Have the suite save homepage and U2 case screenshots for desktop and `mobile-390` under `output/playwright/` for visual review; do not commit the output directory.

Run:

```bash
git add tests/portfolio-ui.spec.js playwright.config.js
git commit -m "test portfolio conversion flows"
```

## Task 10: Final verification, visual review, integration, and production monitoring

**Files:**

- Verify all changed files
- Do not create new feature code unless a failing acceptance check identifies a specific defect

- [ ] **Step 1: Run the complete local verification from a clean process**

Run:

```bash
npm test
npx playwright test
npm run build
git status --short
```

Expected: all unit and browser tests PASS, build exits 0, and only intentional tracked implementation files are shown.

- [ ] **Step 2: Inspect the four generated routes visually**

Run: `npm run preview -- --host 127.0.0.1 --port 3200`

Inspect `/`, `/en`, `/projects/u2`, and `/en/projects/u2` in light/dark themes at 390×844, tablet, and desktop widths. Confirm all three mobile hero CTA controls are above the fold, U2 occurs once on each homepage, career dates are correct, screenshots are crisp, external links are correct, and reduced motion remains readable.

- [ ] **Step 3: Run Lighthouse against the production build**

Run:

```bash
npx --yes lighthouse http://127.0.0.1:3200/ --only-categories=performance,accessibility,seo --chrome-flags="--headless --no-sandbox" --output=json --output-path=output/lighthouse-home-mobile.json
npx --yes lighthouse http://127.0.0.1:3200/projects/u2 --only-categories=performance,accessibility,seo --chrome-flags="--headless --no-sandbox" --output=json --output-path=output/lighthouse-u2-mobile.json
```

Expected on both reports: LCP < 2500 ms, CLS < 0.1, accessibility ≥ 0.95, SEO ≥ 0.95. Confirm the font requests total below 250 KB. If a budget fails, document the failing audit, fix that bottleneck only, and rerun both reports.

- [ ] **Step 4: Review the complete diff**

Run: `git diff main...HEAD --stat && git diff main...HEAD --check`

Expected: no whitespace errors, no secrets, no source PNG captures, no `.superpowers/` files, and no unrelated user changes.

- [ ] **Step 5: Request final code review and address verified findings**

Use `superpowers:requesting-code-review` against the full branch diff. Apply only concrete correctness, accessibility, performance, or requirement findings. Rerun the smallest affected test and then the full verification suite.

- [ ] **Step 6: Integrate and push to main**

Use `superpowers:finishing-a-development-branch`. Because the user already requested publication to `main`, merge the reviewed feature branch into local `main`, rerun `npm test && npm run build`, and then run `git push origin main`.

Expected: push succeeds and the deployment workflow starts for the new main commit.

- [ ] **Step 7: Monitor deployment and production smoke tests**

Run `gh run list --branch main --limit 3`, identify the deployment run for the pushed commit, and use `gh run watch <run-id>` until completion. If GitHub Actions fails, use `superpowers:systematic-debugging`/the CI workflow skill before changing code.

After success, smoke-check:

```bash
curl -I https://amiranbestaev.ru/
curl -I https://amiranbestaev.ru/en
curl -I https://amiranbestaev.ru/projects/u2
curl -I https://amiranbestaev.ru/en/projects/u2
```

Expected: successful HTTPS responses. Open the public homepage and U2 case once on mobile and desktop, verify the new hero, locale routes, U2 screenshots, career section, canonical tags, and absence of console errors.
