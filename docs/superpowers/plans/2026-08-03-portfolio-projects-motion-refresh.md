# Portfolio Projects and Motion Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the duplicated FoodMap project with Novaya, strengthen the project-card design, and add expressive accessible motion across the existing portfolio.

**Architecture:** Keep localized project data as the single source of truth, extend its validated schema with stable IDs and contribution lists, and render the richer data in `WorkSection.vue`. Keep visual styling in the existing portfolio stylesheet and organize GSAP behavior into focused setup functions inside the existing animation composable, with all pointer listeners and animations scoped to the portfolio root and cleaned up on unmount.

**Tech Stack:** Nuxt 3, Vue 3 SFCs, JavaScript/TypeScript types, SCSS, GSAP + ScrollTrigger, Node.js test runner, Playwright.

---

## File map

- Create `tests/portfolio-data.test.js`: data and validator regression tests.
- Create `tests/portfolio-ui.spec.js`: browser-level project, locale, theme, mobile, and reduced-motion checks.
- Create `playwright.config.js`: Nuxt web server and desktop/mobile browser projects.
- Modify `package.json`: add deterministic unit and browser test scripts.
- Modify `data/portfolio/ru.json`: remove FoodMap, add Novaya, project IDs, and Russian contribution lists.
- Modify `data/portfolio/en.json`: keep project parity with English contribution lists.
- Modify `types/portfolio.ts`: describe `id` and `contributions`.
- Modify `lib/portfolio/validate.js`: enforce new fields, unique IDs/URLs, and RU/EN parity.
- Modify `data/systemSections.js`: replace generic repeated case labels with the contribution label.
- Modify `components/sections/WorkSection.vue`: render the Terminal Grid 2.0 card structure.
- Modify `assets/scss/portfolio.scss`: project-card redesign, section accents, ambient signals, hover/focus/touch states, and reduced-motion fallbacks.
- Modify `composables/usePortfolioAnimations.js`: structured hero, reveal, card, pointer, and magnetic-button motion with cleanup.
- Modify `.gitignore`: ignore the local `.superpowers/` Visual Companion drafts.

### Task 1: Project data contract and Novaya content

**Files:**
- Create: `tests/portfolio-data.test.js`
- Modify: `package.json`
- Modify: `data/portfolio/ru.json`
- Modify: `data/portfolio/en.json`
- Modify: `types/portfolio.ts`
- Modify: `lib/portfolio/validate.js`

- [ ] **Step 1: Add the unit-test command**

Add this script to `package.json`:

```json
"test": "node --experimental-default-type=module --test tests/portfolio-data.test.js"
```

- [ ] **Step 2: Write the failing source-data regression test**

Create `tests/portfolio-data.test.js`:

```js
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

import {validatePortfolioCopy} from '../lib/portfolio/validate.js';

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const loadCopy = () => ({
    ru: readJson('../data/portfolio/ru.json'),
    en: readJson('../data/portfolio/en.json'),
});

test('project locales stay aligned and replace FoodMap with Novaya', () => {
    const copy = loadCopy();
    const ruIds = copy.ru.projects.map((project) => project.id);
    const enIds = copy.en.projects.map((project) => project.id);

    assert.deepEqual(enIds, ruIds);
    assert.equal(ruIds.filter((id) => id === 'novaya').length, 1);
    assert.equal(ruIds.includes('foodmap-delivery'), false);

    for (const [locale, data] of Object.entries(copy)) {
        const deliveryLinks = data.projects
            .flatMap((project) => project.links)
            .filter((link) => link.url === 'https://vkusnoibistro.com/application/');

        assert.equal(deliveryLinks.length, 1, `${locale} must contain one delivery URL`);
        assert.equal(data.projects.find((project) => project.id === 'novaya')?.links[0]?.url, 'https://novaya.ru/');
        data.projects.forEach((project) => {
            assert.ok(project.id.length > 0);
            assert.ok(project.contributions.length > 0, `${locale}.${project.id} needs contributions`);
        });
    }

    assert.doesNotThrow(() => validatePortfolioCopy(copy));
});
```

- [ ] **Step 3: Run the test and verify RED**

Run: `npm test`

Expected: FAIL because current projects do not have `id`/`contributions` and `novaya` is absent.

- [ ] **Step 4: Update the project type and the basic validator contract**

Change `PortfolioProject` in `types/portfolio.ts` to:

```ts
export type PortfolioProject = {
    id: string;
    name: string;
    type: string;
    description: string;
    tags: string[];
    contributions: string[];
    links: PortfolioProjectLink[];
};
```

Inside the existing project loop in `lib/portfolio/validate.js`, add:

```js
assertString(project.id, `${ base }.id`);
assertStringArray(project.contributions, `${ base }.contributions`);
assert(project.contributions.length > 0, `${ base }.contributions must be non-empty`);
```

- [ ] **Step 5: Replace and enrich localized project data**

Remove the entire `FoodMap Delivery` object from both locale files. Add the following Novaya objects after `Maks` / `Макс`:

```json
{
  "id": "novaya",
  "name": "Новая",
  "type": "Сайт девелопера недвижимости",
  "description": "Продуктовый интерфейс с каталогом недвижимости, интерактивным генпланом и насыщенной анимацией главной страницы.",
  "tags": ["Vue", "Nuxt", "GSAP", "Performance"],
  "contributions": [
    "Анимации главной страницы и сложных контентных секций",
    "Фильтры недвижимости и детальная страница проекта",
    "Интерактивный генплан и оптимизация производительности"
  ],
  "links": [{"label": "Сайт", "url": "https://novaya.ru/"}]
}
```

```json
{
  "id": "novaya",
  "name": "Novaya",
  "type": "Real-estate developer platform",
  "description": "A product interface with real-estate filters, an interactive masterplan, and motion-rich homepage storytelling.",
  "tags": ["Vue", "Nuxt", "GSAP", "Performance"],
  "contributions": [
    "Homepage motion and complex content sections",
    "Property filters and project detail page",
    "Interactive masterplan and performance optimization"
  ],
  "links": [{"label": "Website", "url": "https://novaya.ru/"}]
}
```

Add stable IDs and contribution lists to all remaining entries using this exact parity map:

| ID | RU contributions | EN contributions |
|---|---|---|
| `fordewind` | Адаптивная вёрстка визуальных продуктовых блоков; Компонентная структура и стилизация интерфейса | Responsive implementation of visual product sections; Component structure and interface styling |
| `u2` | Витрина объектов и сценарии выбора; Фильтры недвижимости и типизированная логика | Property showcase and selection flows; Real-estate filters and typed logic |
| `massandra-park` | Каталог объектов и визуальные секции; Навигация и оптимизация загрузки | Property catalog and visual sections; Navigation and loading optimization |
| `maks` | Промо-интерфейс и адаптивные сценарии; SSR-страницы и визуальная подача объекта | Promotional UI and responsive flows; SSR pages and property presentation |
| `vkusno-i-bystro` | Анимированные компоненты и пользовательские сценарии; Поддержка и стабильность интерфейса в продакшене | Animated components and user flows; Production UI support and stability |
| `tsvet-divanov` | Каталог, фильтры и карточки товаров; SSR и оптимизация скорости витрины | Catalog, filters, and product cards; SSR and storefront performance optimization |

- [ ] **Step 6: Run the test and verify GREEN**

Run: `npm test`

Expected: `1` test passes, `0` fails.

- [ ] **Step 7: Commit the data contract**

```bash
git add package.json tests/portfolio-data.test.js data/portfolio/ru.json data/portfolio/en.json types/portfolio.ts lib/portfolio/validate.js
git commit -m "add novaya portfolio project"
```

### Task 2: Duplicate and locale-parity validation

**Files:**
- Modify: `tests/portfolio-data.test.js`
- Modify: `lib/portfolio/validate.js`

- [ ] **Step 1: Add failing validator tests**

Append to `tests/portfolio-data.test.js`:

```js
test('validator rejects duplicate project ids', () => {
    const copy = loadCopy();
    copy.ru.projects[1].id = copy.ru.projects[0].id;

    assert.throws(
        () => validatePortfolioCopy(copy),
        /ru\.projects contains duplicate id/,
    );
});

test('validator rejects duplicate project URLs', () => {
    const copy = loadCopy();
    copy.ru.projects[1].links[0].url = copy.ru.projects[0].links[0].url;

    assert.throws(
        () => validatePortfolioCopy(copy),
        /ru\.projects contains duplicate URL/,
    );
});

test('validator rejects locale project drift', () => {
    const copy = loadCopy();
    copy.en.projects[0].id = 'unexpected-project';

    assert.throws(
        () => validatePortfolioCopy(copy),
        /ru and en project ids must match in order/,
    );
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test`

Expected: the three new tests FAIL because duplicates and locale drift are currently accepted.

- [ ] **Step 3: Enforce uniqueness within each locale**

In `validateLocale`, create sets before iterating and populate them inside the existing loop:

```js
const projectIds = new Set();
const projectUrls = new Set();

data.projects.forEach((project, index) => {
    const base = `${ locale }.projects[${ index }]`;
    assertObject(project, base);
    assertString(project.id, `${ base }.id`);
    assert(!projectIds.has(project.id), `${ locale }.projects contains duplicate id "${ project.id }"`);
    projectIds.add(project.id);
    assertString(project.name, `${ base }.name`);
    assertString(project.type, `${ base }.type`);
    assertString(project.description, `${ base }.description`);
    assertStringArray(project.tags, `${ base }.tags`);
    assertStringArray(project.contributions, `${ base }.contributions`);
    assert(project.contributions.length > 0, `${ base }.contributions must be non-empty`);
    validateLinks(project.links, `${ base }.links`);
    project.links.forEach((link) => {
        assert(!projectUrls.has(link.url), `${ locale }.projects contains duplicate URL "${ link.url }"`);
        projectUrls.add(link.url);
    });
});
```

- [ ] **Step 4: Enforce RU/EN project parity**

Add this helper and call it after both locales are validated:

```js
const validateProjectParity = (data) => {
    const ruIds = data.ru.projects.map((project) => project.id);
    const enIds = data.en.projects.map((project) => project.id);
    assert(
        ruIds.length === enIds.length && ruIds.every((id, index) => id === enIds[index]),
        'ru and en project ids must match in order',
    );
};

export const validatePortfolioCopy = (data) => {
    assertObject(data, 'portfolioCopy');
    validateLocale(data.ru, 'ru');
    validateLocale(data.en, 'en');
    validateProjectParity(data);
    return data;
};
```

- [ ] **Step 5: Run the tests and verify GREEN**

Run: `npm test`

Expected: `4` tests pass, `0` fails.

- [ ] **Step 6: Commit validation**

```bash
git add tests/portfolio-data.test.js lib/portfolio/validate.js
git commit -m "validate unique portfolio projects"
```

### Task 3: Terminal Grid 2.0 project markup

**Files:**
- Modify: `tests/portfolio-data.test.js`
- Modify: `components/sections/WorkSection.vue`
- Modify: `data/systemSections.js`

- [ ] **Step 1: Add a failing structure regression test**

Append to `tests/portfolio-data.test.js`:

```js
test('work cards render contributions without repeated generic metadata', () => {
    const source = readFileSync(new URL('../components/sections/WorkSection.vue', import.meta.url), 'utf8');

    assert.match(source, /:key="project\.id"/);
    assert.match(source, /project\.contributions/);
    assert.match(source, /data-project-card/);
    assert.doesNotMatch(source, /system\.statusLabel|system\.roleLabel|system\.resultLabel/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test`

Expected: the new structure test FAILS against the existing card markup.

- [ ] **Step 3: Replace the card markup**

Replace the project list inside `WorkSection.vue` with:

```vue
<ul class="work-grid" role="list">
    <li v-for="(project, index) in copy.projects" :key="project.id">
        <article class="work-card reveal" data-project-card>
            <span class="work-card__glow" aria-hidden="true"></span>
            <header class="work-card__top">
                <span class="work-card__index">
                    {{ system.projectPrefix }}_{{ String(index + 1).padStart(2, '0') }}
                </span>
                <div>
                    <h3>{{ project.name }}</h3>
                    <p>{{ project.type }}</p>
                </div>
            </header>
            <p class="work-card__summary">{{ project.description }}</p>
            <div class="work-card__contribution">
                <span>{{ system.contributionLabel }}</span>
                <ul role="list">
                    <li v-for="item in project.contributions" :key="item">{{ item }}</li>
                </ul>
            </div>
            <ul class="work-card__tags" role="list">
                <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
            </ul>
            <div class="work-card__links">
                <template v-if="project.links.length">
                    <a v-for="link in project.links" :key="link.url" :href="link.url" target="_blank"
                       rel="noreferrer">
                        {{ link.label }} <span aria-hidden="true">↗</span>
                    </a>
                </template>
                <span v-else class="work-card__nda">{{ copy.labels.nda }}</span>
            </div>
            <span class="work-card__signal" aria-hidden="true"></span>
        </article>
    </li>
</ul>
```

- [ ] **Step 4: Simplify localized case-system copy**

In both `systemSections.*.cases` objects remove `statusLabel`, `roleLabel`, `stackLabel`, `resultLabel`, `status`, `role`, `result`, `impactValue`, `problem`, `solution`, and `impact`. Add:

```js
contributionLabel: 'ВКЛАД',
```

and:

```js
contributionLabel: 'CONTRIBUTION',
```

- [ ] **Step 5: Run tests and verify GREEN**

Run: `npm test`

Expected: `5` tests pass, `0` fails.

- [ ] **Step 6: Commit card semantics**

```bash
git add tests/portfolio-data.test.js components/sections/WorkSection.vue data/systemSections.js
git commit -m "redesign portfolio project cards"
```

### Task 4: Portfolio-wide visual refresh

**Files:**
- Modify: `tests/portfolio-data.test.js`
- Modify: `assets/scss/portfolio.scss`

- [ ] **Step 1: Add a failing stylesheet contract test**

Append to `tests/portfolio-data.test.js`:

```js
test('portfolio styles include pointer glow, section accents, and reduced-motion fallbacks', () => {
    const source = readFileSync(new URL('../assets/scss/portfolio.scss', import.meta.url), 'utf8');

    assert.match(source, /--pointer-x/);
    assert.match(source, /\.work-card__glow/);
    assert.match(source, /--accent-progress/);
    assert.match(source, /prefers-reduced-motion: reduce/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test`

Expected: the new stylesheet test FAILS because the pointer variables and new card glow do not exist.

- [ ] **Step 3: Establish project-card variables and section accents**

Add a section accent driven by `--accent-progress`, ambient section signals, and per-card pointer variables:

```scss
.section {
    position: relative;
    isolation: isolate;
}

.section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: min(1120px, calc(100% - 32px));
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--portfolio-accent) 28%, transparent), transparent);
    background-size: 200% 100%;
    animation: section-signal 7s linear infinite;
    opacity: 0.8;
}

@keyframes section-signal {
    from { background-position: 200% 0; }
    to { background-position: -200% 0; }
}

.section__head {
    --accent-progress: 1;
}

.section__head::after {
    content: '';
    display: block;
    width: min(160px, 35vw);
    height: 2px;
    margin-top: 18px;
    transform: scaleX(var(--accent-progress));
    transform-origin: left center;
    background: linear-gradient(90deg, var(--portfolio-accent), transparent);
}
```

- [ ] **Step 4: Replace the old work-card styles**

Remove `.work-card__meta` and `.work-card__details`. Implement the new classes with these exact behaviors:

```scss
.work-card {
    --pointer-x: 50%;
    --pointer-y: 50%;
    position: relative;
    overflow: hidden;
    transform-style: preserve-3d;
    min-height: 100%;
    padding: clamp(18px, 2.4vw, 26px);
    gap: 18px;
    border-radius: 18px;
    background:
        linear-gradient(145deg, color-mix(in srgb, var(--portfolio-accent) 7%, transparent), transparent 42%),
        var(--portfolio-surface);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.work-grid > li {
    perspective: 900px;
}

.work-card__glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    background: radial-gradient(260px circle at var(--pointer-x) var(--pointer-y), color-mix(in srgb, var(--portfolio-accent) 18%, transparent), transparent 68%);
    transition: opacity 0.25s ease;
}

.work-card__top,
.work-card__summary,
.work-card__contribution,
.work-card__tags,
.work-card__links {
    position: relative;
    z-index: 1;
}

.work-card__index,
.work-card__contribution > span {
    color: var(--portfolio-accent);
    font: 700 11px/1.2 'SFMono-Regular', Menlo, Monaco, Consolas, monospace;
    letter-spacing: 0.12em;
}

.work-card__summary {
    margin: 0;
    color: var(--portfolio-text);
    line-height: 1.6;
}

.work-card__contribution ul {
    display: grid;
    gap: 8px;
    margin: 10px 0 0;
    padding: 0;
    list-style: none;
}

.work-card__contribution li {
    position: relative;
    padding-left: 16px;
    color: var(--portfolio-muted);
    line-height: 1.45;
}

.work-card__contribution li::before {
    content: '›';
    position: absolute;
    left: 0;
    color: var(--portfolio-accent);
}

.work-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.work-card__tags li {
    padding: 5px 8px;
    border: 1px solid var(--portfolio-border);
    border-radius: 999px;
    color: var(--portfolio-muted);
    font: 11px/1.2 'SFMono-Regular', Menlo, Monaco, Consolas, monospace;
}

.work-card__signal {
    position: absolute;
    right: -30%;
    bottom: 0;
    width: 55%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--portfolio-accent), transparent);
    transition: right 0.45s ease;
}

@media (hover: hover) and (pointer: fine) {
    .work-card:hover {
        border-color: color-mix(in srgb, var(--portfolio-accent) 58%, var(--portfolio-border));
        box-shadow: 0 24px 54px color-mix(in srgb, var(--portfolio-shadow-strong) 36%, transparent);
    }

    .work-card:hover .work-card__glow { opacity: 1; }
    .work-card:hover .work-card__signal { right: 75%; }
}
```

- [ ] **Step 5: Refresh supporting cards and buttons**

Add consistent hover and keyboard-focus behavior without changing layout dimensions:

```scss
.profile-card,
.approach-item,
.skill-card,
.principle-card,
.btn {
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.btn:focus-visible,
.approach-item__head:focus-visible,
.work-card__links a:focus-visible {
    outline: 2px solid var(--portfolio-accent);
    outline-offset: 3px;
}

@media (hover: hover) and (pointer: fine) {
    .profile-card:hover,
    .approach-item:hover,
    .skill-card:hover,
    .principle-card:hover {
        transform: translateY(-2px);
        border-color: color-mix(in srgb, var(--portfolio-accent) 42%, var(--portfolio-border));
        box-shadow: 0 20px 42px color-mix(in srgb, var(--portfolio-shadow-strong) 24%, transparent);
    }
}
```

- [ ] **Step 6: Add mobile and reduced-motion fallbacks**

Append:

```scss
@media (hover: none), (pointer: coarse) {
    .work-card {
        transform: none !important;
    }

    .work-card__glow {
        display: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

    .work-card,
    .btn {
        transform: none !important;
    }
}
```

- [ ] **Step 7: Run tests and check stylesheet syntax**

Run:

```bash
npm test
npm run build
```

Expected: `6` unit tests pass; Nuxt production build completes with exit code `0` and no Sass errors.

- [ ] **Step 8: Commit the visual layer**

```bash
git add tests/portfolio-data.test.js assets/scss/portfolio.scss
git commit -m "refresh portfolio visual system"
```

### Task 5: Structured GSAP and pointer interactions

**Files:**
- Modify: `tests/portfolio-data.test.js`
- Modify: `composables/usePortfolioAnimations.js`

- [ ] **Step 1: Add a failing animation-structure test**

Append to `tests/portfolio-data.test.js`:

```js
test('portfolio animation composable scopes pointer motion and cleanup', () => {
    const source = readFileSync(new URL('../composables/usePortfolioAnimations.js', import.meta.url), 'utf8');

    assert.match(source, /setupHeroPointerMotion/);
    assert.match(source, /setupProjectCardMotion/);
    assert.match(source, /setupMagneticButtons/);
    assert.match(source, /cleanupCallbacks\.splice/);
    assert.match(source, /\(hover: hover\) and \(pointer: fine\)/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test`

Expected: the new animation test FAILS because the focused setup functions do not exist.

- [ ] **Step 3: Split animation setup by responsibility**

Directly after `let gsapContext`, declare `cleanupCallbacks` and the focused setup functions. Keep the reduced-motion early return and GSAP context in `onMounted`:

```js
let cleanupCallbacks = [];

const setupHeroMotion = (gsap) => {
    const heroTimeline = gsap.timeline();

    heroTimeline.from('.hero__boot p', {
        opacity: 0,
        x: -14,
        duration: 0.25,
        stagger: 0.08,
        ease: 'none',
    });
    heroTimeline.from('.hero__eyebrow', {opacity: 0, y: 12, duration: 0.35, ease: 'none'}, '-=0.04');
    heroTimeline.from('.hero__title-reveal', {
        opacity: 0,
        y: 36,
        duration: 0.45,
        stagger: 0.08,
        ease: 'none',
    }, '-=0.08');
    heroTimeline.from('.hero__subtitle', {opacity: 0, y: 14, duration: 0.35, ease: 'none'}, '-=0.05');
    heroTimeline.from('.hero__meta', {opacity: 0, y: 12, duration: 0.35, ease: 'none'}, '-=0.1');
    heroTimeline.from('.hero__cta .btn', {
        opacity: 0,
        y: 12,
        duration: 0.35,
        stagger: 0.12,
        ease: 'none',
    }, '-=0.08');
    heroTimeline.from('.hero__command-hint', {opacity: 0, y: 8, duration: 0.3, ease: 'none'}, '-=0.08');

    gsap.from('.stat-card', {opacity: 0, y: 14, duration: 0.45, delay: 0.5, stagger: 0.1, ease: 'none'});
    gsap.from('.hero__visual', {opacity: 0, scale: 0.94, duration: 0.55, delay: 0.45, ease: 'none'});

    const scrollMotion = [
        ['.hero__glow', {yPercent: 15}],
        ['.hero__orb--main', {yPercent: 12, xPercent: -6}],
        ['.hero__ring--one', {rotation: 24}],
        ['.hero__ring--two', {rotation: -18}],
        ['.hero__signal--one', {xPercent: 6}],
        ['.hero__signal--two', {xPercent: -6}],
    ];

    scrollMotion.forEach(([selector, values]) => {
        gsap.to(selector, {
            ...values,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        });
    });
};

const setupRevealMotion = (gsap) => {
    gsap.utils.toArray('.reveal').forEach((element, index) => {
        gsap.from(element, {
            opacity: 0,
            y: 26,
            duration: 0.6,
            delay: Math.min(index * 0.025, 0.16),
            ease: 'power2.out',
            scrollTrigger: {trigger: element, start: 'top 86%', once: true},
        });
    });

    gsap.utils.toArray('.section__head').forEach((element) => {
        gsap.from(element, {
            '--accent-progress': 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {trigger: element, start: 'top 88%', once: true},
        });
    });
};
```

- [ ] **Step 4: Add fine-pointer hero response, card tilt, and glow coordinates**

Add a small hero response that runs only for a fine pointer:

```js
const setupHeroPointerMotion = (gsap, rootEl) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return;
    }

    const hero = rootEl.querySelector('.hero');
    const visual = rootEl.querySelector('.hero__visual');
    if (!hero || !visual) {
        return;
    }

    const moveX = gsap.quickTo(visual, 'x', {duration: 0.8, ease: 'power3.out'});
    const moveY = gsap.quickTo(visual, 'y', {duration: 0.8, ease: 'power3.out'});
    const onPointerMove = (event) => {
        const rect = hero.getBoundingClientRect();
        moveX((((event.clientX - rect.left) / rect.width) - 0.5) * 10);
        moveY((((event.clientY - rect.top) / rect.height) - 0.5) * 8);
    };
    const onPointerLeave = () => {
        moveX(0);
        moveY(0);
    };

    hero.addEventListener('pointermove', onPointerMove);
    hero.addEventListener('pointerleave', onPointerLeave);
    cleanupCallbacks.push(() => {
        hero.removeEventListener('pointermove', onPointerMove);
        hero.removeEventListener('pointerleave', onPointerLeave);
    });
};
```

Add project-card motion using `gsap.quickTo` and root-scoped cards:

Use `gsap.quickTo` and root-scoped cards:

```js
const setupProjectCardMotion = (gsap, rootEl) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return;
    }

    rootEl.querySelectorAll('[data-project-card]').forEach((card) => {
        const rotateX = gsap.quickTo(card, 'rotationX', {duration: 0.35, ease: 'power2.out'});
        const rotateY = gsap.quickTo(card, 'rotationY', {duration: 0.35, ease: 'power2.out'});

        const onPointerMove = (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            card.style.setProperty('--pointer-x', `${ x * 100 }%`);
            card.style.setProperty('--pointer-y', `${ y * 100 }%`);
            rotateX((0.5 - y) * 5);
            rotateY((x - 0.5) * 6);
        };

        const onPointerLeave = () => {
            rotateX(0);
            rotateY(0);
        };

        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerleave', onPointerLeave);
        cleanupCallbacks.push(() => {
            card.removeEventListener('pointermove', onPointerMove);
            card.removeEventListener('pointerleave', onPointerLeave);
        });
    });
};
```

- [ ] **Step 5: Add moderate magnetic CTA motion**

Add:

```js
const setupMagneticButtons = (gsap, rootEl) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return;
    }

    rootEl.querySelectorAll('.hero__cta .btn').forEach((button) => {
        const moveX = gsap.quickTo(button, 'x', {duration: 0.3, ease: 'power2.out'});
        const moveY = gsap.quickTo(button, 'y', {duration: 0.3, ease: 'power2.out'});
        const onPointerMove = (event) => {
            const rect = button.getBoundingClientRect();
            moveX((((event.clientX - rect.left) / rect.width) - 0.5) * 8);
            moveY((((event.clientY - rect.top) / rect.height) - 0.5) * 6);
        };
        const onPointerLeave = () => {
            moveX(0);
            moveY(0);
        };

        button.addEventListener('pointermove', onPointerMove);
        button.addEventListener('pointerleave', onPointerLeave);
        cleanupCallbacks.push(() => {
            button.removeEventListener('pointermove', onPointerMove);
            button.removeEventListener('pointerleave', onPointerLeave);
        });
    });
};
```

- [ ] **Step 6: Wire setup and cleanup**

Inside the GSAP context call:

```js
setupHeroMotion(gsap);
setupRevealMotion(gsap);
setupHeroPointerMotion(gsap, rootEl);
setupProjectCardMotion(gsap, rootEl);
setupMagneticButtons(gsap, rootEl);
```

In `onBeforeUnmount`, run listeners before reverting GSAP:

```js
cleanupCallbacks.splice(0).forEach((cleanup) => cleanup());
if (gsapContext) {
    gsapContext.revert();
}
```

- [ ] **Step 7: Run tests and verify compilation**

Run:

```bash
npm test
npm run build
```

Expected: `7` unit tests pass; build exits `0` with no missing selector or GSAP import errors.

- [ ] **Step 8: Commit motion**

```bash
git add tests/portfolio-data.test.js composables/usePortfolioAnimations.js
git commit -m "add responsive portfolio motion"
```

### Task 6: Browser regression coverage and final verification

**Files:**
- Create: `playwright.config.js`
- Create: `tests/portfolio-ui.spec.js`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Add browser test configuration**

Create `playwright.config.js`:

```js
import {defineConfig, devices} from 'playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: 'portfolio-ui.spec.js',
    webServer: {
        command: 'npm run dev -- --host 127.0.0.1',
        url: 'http://127.0.0.1:3000',
        reuseExistingServer: true,
        timeout: 120000,
    },
    use: {
        baseURL: 'http://127.0.0.1:3000',
        trace: 'retain-on-failure',
    },
    projects: [
        {name: 'desktop-chromium', use: {...devices['Desktop Chrome']}},
        {name: 'mobile-chromium', use: {...devices['Pixel 7']}},
    ],
});
```

Add to `package.json`:

```json
"test:ui": "playwright test"
```

- [ ] **Step 2: Write the browser regression test**

Create `tests/portfolio-ui.spec.js`:

```js
import {mkdirSync} from 'node:fs';

import {expect, test} from 'playwright/test';

test('renders unique project cases in RU and EN without overflow', async ({page}, testInfo) => {
    const consoleErrors = [];
    page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
    });

    await page.goto('/');
    const work = page.locator('#work');
    await work.scrollIntoViewIfNeeded();

    await expect(work.locator('[data-project-card]')).toHaveCount(7);
    await expect(work.getByRole('heading', {name: 'Новая'})).toBeVisible();
    await expect(work.getByText('FoodMap Delivery')).toHaveCount(0);
    await expect(work.locator('a[href="https://vkusnoibistro.com/application/"]')).toHaveCount(1);
    await expect(work.locator('a[href="https://novaya.ru/"]')).toHaveCount(1);
    await expect(work.getByText('Интерактивный генплан и оптимизация производительности')).toBeVisible();

    await page.locator('button.lang-toggle:visible').click();
    await expect(work.getByRole('heading', {name: 'Novaya'})).toBeVisible();
    await expect(work.getByText('Interactive masterplan and performance optimization')).toBeVisible();

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasOverflow).toBe(false);
    expect(consoleErrors).toEqual([]);

    mkdirSync('output/playwright', {recursive: true});
    await page.screenshot({
        path: `output/playwright/portfolio-${testInfo.project.name}.png`,
        fullPage: true,
    });
});

test.describe('reduced motion', () => {
    test.use({reducedMotion: 'reduce', colorScheme: 'dark'});

    test('theme and reduced motion keep project content usable', async ({page}) => {
    await page.goto('/');
    await page.locator('#work').scrollIntoViewIfNeeded();

    await expect(page.locator('[data-project-card]').first()).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const transform = await page.locator('[data-project-card]').first().evaluate((card) => getComputedStyle(card).transform);
    expect(transform === 'none' || transform.includes('matrix(1, 0, 0, 1')).toBe(true);
    });
});
```

- [ ] **Step 3: Run browser tests and verify GREEN**

Run: `npx playwright test`

Expected: `4` project/browser combinations pass, `0` fail. If Chromium is missing, run `npx playwright install chromium` and rerun.

- [ ] **Step 4: Capture visual evidence**

The first browser test creates one screenshot per configured project. Run `npx playwright test`, then inspect `output/playwright/portfolio-desktop-chromium.png` and `output/playwright/portfolio-mobile-chromium.png`. Also verify RU/EN switching, light/dark theme, keyboard focus, pointer hover, and console output in a headed run with `npx playwright test --headed --project=desktop-chromium`.

Expected: readable two-column/one-column grids, no clipped contributions, no horizontal overflow, and no console errors.

- [ ] **Step 5: Ignore Visual Companion drafts**

Append to `.gitignore`:

```gitignore
.superpowers/
```

- [ ] **Step 6: Run the complete verification suite**

Run:

```bash
npm test
npx playwright test
npm run build
git diff --check
```

Expected: `7` unit tests pass, `4` browser/project combinations pass, production build exits `0`, and `git diff --check` prints no errors.

- [ ] **Step 7: Commit browser coverage and housekeeping**

```bash
git add playwright.config.js tests/portfolio-ui.spec.js package.json .gitignore
git commit -m "test portfolio project experience"
```

- [ ] **Step 8: Review final scope**

Run `git status --short` and `git log --oneline -7`. Confirm only the planned files changed, all requested content is present, and the Visual Companion drafts remain untracked-but-ignored.
