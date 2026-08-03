import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync} from 'node:fs';
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

test('both locales expose the featured U2 case contract', () => {
    const copy = loadCopy();
    const expectations = {
        ru: {
            casePath: '/projects/u2',
            teaserAlt: 'Главная страница жилого комплекса ЮТУ',
        },
        en: {
            casePath: '/en/projects/u2',
            teaserAlt: 'U2 residential project homepage',
        },
    };

    for (const [locale, expected] of Object.entries(expectations)) {
        const featuredProjects = copy[locale].projects.filter((project) => project.featured);
        assert.equal(featuredProjects.length, 1, `${ locale } must have exactly one featured project`);

        const [u2] = featuredProjects;
        assert.equal(u2.id, 'u2');
        assert.equal(u2.casePath, expected.casePath);
        assert.deepEqual(u2.teaserMedia, {
            avif: '/projects/u2/u2-home-desktop.avif',
            webp: '/projects/u2/u2-home-desktop.webp',
            alt: expected.teaserAlt,
            width: 1600,
            height: 1000,
        });
        assert.equal(u2.case.gallery.length, 4);
        assert.equal(u2.case.facts.length, 4);
        assert.equal(u2.case.narrative.length, 4);

        [...u2.case.gallery, u2.teaserMedia].forEach((media) => {
            assert.match(media.avif, /^\/projects\/u2\//);
            assert.match(media.webp, /^\/projects\/u2\//);
            assert.ok(media.alt.trim().length > 0);
            assert.ok(media.width > 0);
            assert.ok(media.height > 0);
        });
    }
});

test('localized portfolio copy preserves the approved hero, proof, navigation, and section contract', () => {
    const copy = loadCopy();
    const expectations = {
        ru: {
            ctas: ['Смотреть U2', 'Связаться', 'Скачать CV'],
            nav: {experience: 'Опыт', u2: 'U2', projects: 'Проекты', stack: 'Стек', contact: 'Контакты'},
            sections: {featured: 'Флагманский кейс', experience: 'Опыт', projects: 'Другие проекты', skills: 'Стек', principles: 'Принципы'},
        },
        en: {
            ctas: ['View U2', 'Contact', 'Download CV'],
            nav: {experience: 'Experience', u2: 'U2', projects: 'Projects', stack: 'Stack', contact: 'Contact'},
            sections: {featured: 'Featured case', experience: 'Experience', projects: 'Other projects', skills: 'Stack', principles: 'Principles'},
        },
    };

    for (const [locale, expected] of Object.entries(expectations)) {
        const data = copy[locale];
        assert.equal(data.hero.role, 'Frontend Engineer');
        assert.deepEqual([data.hero.ctaPrimary, data.hero.ctaSecondary, data.hero.ctaCv], expected.ctas);
        assert.deepEqual(data.stats.map((stat) => stat.value), ['5+', 'Vue 2/3 · Nuxt 2/3', '2']);
        assert.deepEqual(data.nav, expected.nav);
        assert.deepEqual(
            Object.fromEntries(Object.entries(data.sections).map(([key, section]) => [key, section.title])),
            expected.sections,
        );
    }
});

test('validator rejects more than one featured project', () => {
    const copy = loadCopy();
    copy.ru.projects[0].featured = true;

    assert.throws(
        () => validatePortfolioCopy(copy),
        /ru\.projects must contain exactly one featured project/,
    );
});

test('validator requires the English U2 case narrative', () => {
    const copy = loadCopy();
    delete copy.en.projects.find((project) => project.id === 'u2').case.narrative;

    assert.throws(
        () => validatePortfolioCopy(copy),
        /en\.projects\[\d+\]\.case\.narrative must be an array/,
    );
});

test('validator requires the ordered U2 technology contract', () => {
    const copy = loadCopy();
    copy.en.projects.find((project) => project.id === 'u2').case.technologies[0] = 'React';

    assert.throws(
        () => validatePortfolioCopy(copy),
        /en\.projects\[\d+\]\.case\.technologies must match the U2 technology contract/,
    );
});

test('validator rejects duplicate U2 gallery media', () => {
    const copy = loadCopy();
    const gallery = copy.en.projects.find((project) => project.id === 'u2').case.gallery;
    gallery[1] = {...gallery[0]};

    assert.throws(
        () => validatePortfolioCopy(copy),
        /en\.projects\[\d+\]\.case\.gallery\[1\]\.avif must match the canonical U2 media path/,
    );
});

test('validator rejects traversal U2 gallery media', () => {
    const copy = loadCopy();
    const gallery = copy.en.projects.find((project) => project.id === 'u2').case.gallery;
    gallery[0].avif = '/projects/u2/../u2-home-desktop.avif';

    assert.throws(
        () => validatePortfolioCopy(copy),
        /en\.projects\[\d+\]\.case\.gallery\[0\]\.avif must match the canonical U2 media path/,
    );
});

test('validator requires the ordered U2 narrative contract', () => {
    const copy = loadCopy();
    const narrative = copy.en.projects.find((project) => project.id === 'u2').case.narrative;
    [narrative[0], narrative[1]] = [narrative[1], narrative[0]];

    assert.throws(
        () => validatePortfolioCopy(copy),
        /en\.projects\[\d+\]\.case\.narrative must match the U2 narrative order/,
    );
});

test('validator rejects a featured U2 project without a public link', () => {
    const copy = loadCopy();
    copy.en.projects.find((project) => project.id === 'u2').links = [];

    assert.throws(
        () => validatePortfolioCopy(copy),
        /en\.projects\[\d+\]\.links\[0\]\.url must be the canonical public U2 URL/,
    );
});

test('validator rejects a non-canonical featured U2 public link', () => {
    const copy = loadCopy();
    copy.ru.projects.find((project) => project.id === 'u2').links[0].url = 'https://example.com/u2';

    assert.throws(
        () => validatePortfolioCopy(copy),
        /ru\.projects\[\d+\]\.links\[0\]\.url must be the canonical public U2 URL/,
    );
});

test('portfolio home composes the identity, flagship case, career, and supporting work in order', () => {
    const source = readFileSync(new URL('../components/portfolio/PortfolioHome.vue', import.meta.url), 'utf8');
    const sectionOrder = [
        '<HeroSection',
        '<FeaturedCaseSection',
        '<CareerSection',
        '<WorkSection',
        '<SkillsSection',
        '<PrinciplesSection',
    ].map((component) => source.indexOf(component));

    assert.ok(sectionOrder.every((index) => index >= 0));
    assert.deepEqual([...sectionOrder].sort((a, b) => a - b), sectionOrder);
    assert.match(source, /<HeroSection\s+:copy="t"\s+:featured-project="featuredProject"/);
    assert.match(source, /<FeaturedCaseSection\s+id="u2"\s+:project="featuredProject"\s+:section="t\.sections\.featured"/);
    assert.match(source, /<CareerSection\s+id="experience"\s+:items="t\.experience"\s+:section="t\.sections\.experience"/);
    assert.match(source, /<WorkSection\s+id="projects"\s+:copy="t"/);
    assert.match(source, /<SkillsSection\s+id="stack"\s+:copy="t"/);
    assert.match(source, /<PrinciplesSection\s+id="principles"\s+:copy="t"/);
    assert.match(source, /\.find\(\(\{featured\}\) => featured\)/);
    assert.doesNotMatch(source, /<AboutSection|<ExperienceSection/);
});

test('hero renders data-driven identity and exactly three approved calls to action', () => {
    const source = readFileSync(new URL('../components/sections/HeroSection.vue', import.meta.url), 'utf8');
    const ctaOrder = [
        'featuredProject.casePath',
        'resumeUrl',
        '#contact',
    ].map((value) => source.indexOf(value));

    assert.match(source, /data-hero-identity/);
    assert.match(source, /copy\.hero\.name/);
    assert.match(source, /data-hero-role/);
    assert.match(source, /copy\.hero\.role/);
    assert.equal(source.match(/data-hero-cta/g)?.length, 3);
    assert.deepEqual([...ctaOrder].sort((a, b) => a - b), ctaOrder);
    assert.match(source, /copy\.hero\.ctaPrimary/);
    assert.match(source, /copy\.hero\.ctaCv/);
    assert.match(source, /copy\.hero\.ctaSecondary/);
    assert.match(source, /aria-labelledby="hero-title"/);
    assert.match(source, /class="hero__glow" aria-hidden="true"/);
    assert.match(source, /class="hero__grid" aria-hidden="true"/);
    assert.match(source, /class="hero__visual" aria-hidden="true"/);
    assert.doesNotMatch(source, /style="[^"]*(?:opacity|transform)/);
});

test('featured case and career components expose their semantic content contracts', () => {
    const featured = readFileSync(new URL('../components/sections/FeaturedCaseSection.vue', import.meta.url), 'utf8');
    const career = readFileSync(new URL('../components/sections/CareerSection.vue', import.meta.url), 'utf8');

    assert.match(featured, /data-featured-case="u2"/);
    assert.equal(featured.match(/data-featured-case="u2"/g)?.length, 1);
    assert.match(featured, /<picture/);
    assert.match(featured, /type="image\/avif"/);
    assert.match(featured, /project\.teaserMedia\.webp/);
    assert.match(featured, /fetchpriority="high"/);
    assert.match(featured, /<NuxtLink/);
    assert.match(featured, /target="_blank"/);
    assert.match(featured, /rel="noreferrer"/);
    assert.match(featured, /aria-labelledby="featured-case-title"/);

    assert.match(career, /<ol[^>]*role="list"/);
    assert.match(career, /data-career-entry/);
    assert.match(career, /item\.company/);
    assert.match(career, /item\.role/);
    assert.match(career, /item\.period/);
    assert.match(career, /item\.stack/);
    assert.match(career, /item\.bullets/);
    assert.match(career, /aria-labelledby="career-title"/);
});

test('supporting work excludes the featured project and renders compact truthful cards', () => {
    const source = readFileSync(new URL('../components/sections/WorkSection.vue', import.meta.url), 'utf8');
    const copy = loadCopy();

    assert.match(source, /const props = defineProps/);
    assert.match(source, /props\.copy\.projects\.filter\(project => !project\.featured\)/);
    assert.doesNotMatch(source, /const \{copy\} = defineProps/);
    assert.match(source, /:key="project\.id"/);
    assert.match(source, /data-project-card/);
    assert.match(source, /project\.name/);
    assert.match(source, /project\.type/);
    assert.match(source, /project\.description/);
    assert.match(source, /project\.contributions/);
    assert.match(source, /project\.tags/);
    assert.match(source, /project\.links\[0\]/);
    assert.match(source, /target="_blank"/);
    assert.match(source, /rel="noreferrer"/);
    assert.equal(copy.en.projects.filter((project) => !project.featured).length, 6);
});

test('skills and principles use localized section copy while preserving their source data', () => {
    const skills = readFileSync(new URL('../components/sections/SkillsSection.vue', import.meta.url), 'utf8');
    const principles = readFileSync(new URL('../components/sections/PrinciplesSection.vue', import.meta.url), 'utf8');

    assert.match(skills, /copy\.sections\.skills\.title/);
    assert.match(skills, /copy\.sections\.skills\.subtitle/);
    assert.match(skills, /copy\.skills/);
    assert.match(principles, /copy\.sections\.principles\.title/);
    assert.match(principles, /copy\.sections\.principles\.subtitle/);
    assert.match(principles, /systemSections/);
    assert.doesNotMatch(principles, /<button|aria-expanded/);
});

test('portfolio styles include pointer glow, section accents, and reduced-motion fallbacks', () => {
    const source = readFileSync(new URL('../assets/scss/portfolio.scss', import.meta.url), 'utf8');

    assert.match(source, /--pointer-x/);
    assert.match(source, /\.work-card__glow/);
    assert.match(source, /--accent-progress/);
    assert.match(source, /prefers-reduced-motion: reduce/);
});

test('Montserrat CSS declares exactly two variable WOFF2 faces', () => {
    const source = readFileSync(new URL('../assets/scss/base/fonts.scss', import.meta.url), 'utf8');
    const faces = source.match(/@font-face\s*\{/g) || [];

    assert.equal(faces.length, 2);
    assert.match(source, /Montserrat-VariableFont_wght\.woff2/);
    assert.match(source, /Montserrat-Italic-VariableFont_wght\.woff2/);
    assert.match(source, /url\(['"]\/fonts\/Montserrat-VariableFont_wght\.woff2['"]\)/);
    assert.match(source, /url\(['"]\/fonts\/Montserrat-Italic-VariableFont_wght\.woff2['"]\)/);
    assert.equal(source.match(/font-weight:\s*100 900/g)?.length, 2);
    assert.match(source, /font-style:\s*normal/);
    assert.match(source, /font-style:\s*italic/);
    assert.equal(source.match(/font-display:\s*swap/g)?.length, 2);
    assert.doesNotMatch(source, /\.ttf/i);
});

test('generated Montserrat WOFF2 files are valid and reasonably sized', () => {
    const conversionScript = readFileSync(new URL('../scripts/convert-fonts.py', import.meta.url), 'utf8');
    const fontUrls = [
        new URL('../public/fonts/Montserrat-VariableFont_wght.woff2', import.meta.url),
        new URL('../public/fonts/Montserrat-Italic-VariableFont_wght.woff2', import.meta.url),
    ];
    let totalSize = 0;

    fontUrls.forEach((fontUrl) => {
        assert.equal(existsSync(fontUrl), true, `${ fontUrl.pathname } must exist`);
        const size = statSync(fontUrl).size;
        totalSize += size;
        assert.ok(size > 100_000 && size < 1_000_000, `${ fontUrl.pathname } has an unexpected size`);
        assert.equal(readFileSync(fontUrl).subarray(0, 4).toString('ascii'), 'wOF2');
    });

    assert.ok(totalSize < 1_500_000, 'variable fonts should stay smaller than the static font set');
    assert.match(conversionScript, /TTFont\(source_path, recalcTimestamp=False\)/);
});

test('Nuxt preloads only the upright Montserrat variable font', () => {
    const source = readFileSync(new URL('../nuxt.config.ts', import.meta.url), 'utf8');

    assert.match(source, /rel:\s*['"]preload['"]/);
    assert.match(source, /href:\s*['"]\/fonts\/Montserrat-VariableFont_wght\.woff2['"]/);
    assert.match(source, /as:\s*['"]font['"]/);
    assert.match(source, /type:\s*['"]font\/woff2['"]/);
    assert.match(source, /crossorigin:\s*['"]anonymous['"]/);
    assert.doesNotMatch(source, /preload[^\n]*Montserrat-Italic-VariableFont_wght\.woff2/);
});

test('portfolio animation loading is progressive, guarded, and cancellable', () => {
    const source = readFileSync(new URL('../composables/usePortfolioAnimations.js', import.meta.url), 'utf8');

    assert.match(source, /requestIdleCallback/);
    assert.match(source, /cancelIdleCallback/);
    assert.match(source, /setTimeout/);
    assert.match(source, /clearTimeout/);
    assert.match(source, /prefers-reduced-motion:\s*reduce/);
    assert.match(source, /\(hover: hover\) and \(pointer: fine\)/);
    assert.match(source, /try\s*\{/);
    assert.match(source, /catch\s*\{/);
    assert.match(source, /import\(['"]gsap['"]\)/);
    assert.match(source, /import\(['"]gsap\/ScrollTrigger['"]\)/);
    assert.match(source, /cleanupCallbacks\.splice/);
    assert.doesNotMatch(source, /gsap\.set\(/);
    assert.doesNotMatch(source, /style\.(?:opacity|visibility)\s*=\s*['"]?0/);
});

test('portfolio styles expose responsive home and U2 case layout contracts', () => {
    const source = readFileSync(new URL('../assets/scss/portfolio.scss', import.meta.url), 'utf8');
    const selectors = [
        '.featured-case',
        '.featured-case__media',
        '.career-list',
        '.career-entry',
        '.case-page',
        '.case-hero',
        '.case-facts',
        '.case-narrative',
        '.case-gallery',
        '.case-media__visual',
        '.case-media__fallback',
        '.case-result',
        '.case-navigation',
    ];

    selectors.forEach((selector) => assert.match(source, new RegExp(selector.replace('.', '\\\.'))));
    assert.match(source, /min-width:\s*0/);
    assert.match(source, /overflow-wrap:\s*anywhere/);
    assert.match(source, /object-fit:\s*(?:cover|contain)/);
    assert.match(source, /aspect-ratio/);
    assert.match(source, /@media\s*\(max-width:\s*420px\)/);
});

test('portfolio animation composable scopes pointer motion and cleanup', () => {
    const source = readFileSync(new URL('../composables/usePortfolioAnimations.js', import.meta.url), 'utf8');

    assert.match(source, /setupHeroPointerMotion/);
    assert.match(source, /setupProjectCardMotion/);
    assert.match(source, /setupMagneticButtons/);
    assert.match(source, /cleanupCallbacks\.splice/);
    assert.match(source, /\(hover: hover\) and \(pointer: fine\)/);
});

test('global navigation uses route-aware Nuxt links, approved section ids, and safe focus restoration', () => {
    const header = readFileSync(new URL('../components/Header.vue', import.meta.url), 'utf8');
    const palette = readFileSync(new URL('../components/CommandPalette.vue', import.meta.url), 'utf8');
    const footer = readFileSync(new URL('../components/Footer.vue', import.meta.url), 'utf8');
    const approvedIds = ['experience', 'u2', 'projects', 'stack', 'contact'];

    for (const source of [header, palette]) {
        assert.match(source, /import \{portfolioRoutes\} from '~\/lib\/portfolio\/routes\.js';/);
        assert.match(source, /portfolioRoutes\[lang\.value\]\.home/);
        assert.match(source, /<NuxtLink/);
        assert.match(source, /:to="sectionTarget\(item\.id\)"/);
        approvedIds.forEach((id) => assert.match(source, new RegExp(`['\"]${id}['\"]`)));
        ['profile', 'approach', 'work', 'principles'].forEach((id) => {
            assert.doesNotMatch(source, new RegExp(`id: ['\"]${id}['\"]`));
        });
    }

    assert.match(header, /<NuxtLink class="brand" :to="homePath"/);
    assert.match(header, /ref="burgerButton"/);
    assert.match(header, /ref="closeButton"/);
    assert.match(header, /nextTick\(\(\) => closeButton\.value\?\.focus\(\)\)/);
    assert.match(header, /if \(wasMenuOpen && restoreFocus\)\s*\{\s*nextTick\(\(\) => burgerButton\.value\?\.focus\(\)\)/);
    assert.match(header, /\(\) => route\.fullPath/);
    assert.match(palette, /\(\) => route\.fullPath/);
    assert.match(footer, /t\.footer\.title/);
    assert.match(footer, /t\.footer\.subtitle/);
    assert.doesNotMatch(footer, /systemSections/);
});

test('navigation orders live sections by document position and protects modal interaction', () => {
    const header = readFileSync(new URL('../components/Header.vue', import.meta.url), 'utf8');
    const palette = readFileSync(new URL('../components/CommandPalette.vue', import.meta.url), 'utf8');
    const activeSection = readFileSync(new URL('../composables/useActiveSection.js', import.meta.url), 'utf8');

    assert.match(activeSection, /\.sort\(\(left, right\) => left\.offsetTop - right\.offsetTop\)/);
    assert.match(activeSection, /\(\) => route\.path/);
    assert.match(header, /isHomeRoute && activeSection === item\.id/);
    assert.match(header, /const isPlainPrimaryClick = \(event\)/);
    assert.match(header, /@click="scrollToTop\(\$event\)"/);
    assert.match(header, /event\.button !== 0 \|\| event\.metaKey \|\| event\.ctrlKey \|\| event\.shiftKey \|\| event\.altKey/);
    assert.match(header, /ref="mobileMenu"/);
    assert.match(header, /@keydown="trapFocus\(\$event, mobileMenu\)"/);
    assert.match(header, /closeMobileMenu\(false\);/);
    assert.match(header, /new CustomEvent\('portfolio:command-open'/);

    assert.match(palette, /ref="palettePanel"/);
    assert.match(palette, /@keydown="trapFocus\(\$event, palettePanel\)"/);
    assert.match(palette, /const opener = ref\(null\);/);
    assert.match(palette, /nextTick\(\(\) => closeButton\.value\?\.focus\(\)\)/);
    assert.match(palette, /restoreTarget\?\.isConnected/);
    assert.match(palette, /event\.button !== 0 \|\| event\.metaKey \|\| event\.ctrlKey \|\| event\.shiftKey \|\| event\.altKey/);
    assert.match(palette, /:aria-label="lang === 'ru' \? 'Закрыть' : 'Close'"/);
});

test('U2 case page composes all approved evidence sections in order', () => {
    const source = readFileSync(new URL('../components/case/U2CasePage.vue', import.meta.url), 'utf8');
    const componentOrder = [
        'CaseHero',
        'CaseFacts',
        'CaseNarrative',
        'CaseGallery',
        'CaseResult',
        'CaseNavigation',
    ].map((component) => source.indexOf(`<${ component }`));

    assert.ok(componentOrder.every((index) => index >= 0));
    assert.deepEqual([...componentOrder].sort((left, right) => left - right), componentOrder);
    assert.match(source, /<div ref="root" class="case-page" data-case-page="u2">/);
    assert.match(source, /const \{t, lang\} = useLanguage\(\);/);
    assert.match(source, /\.find\(\(\{id\}\) => id === 'u2'\)/);
    assert.match(source, /const caseData = computed\(\(\) => project\.value\?\.case\);/);
    assert.match(source, /createError\(\{statusCode: 404, statusMessage: 'U2 case not found'\}\)/);
    assert.match(source, /portfolioRoutes\[lang\.value\]\.home/);
    assert.match(source, /const externalUrl = computed\(\(\) => project\.value\?\.links\?\.\[0\]\?\.url\);/);
    assert.match(source, /!project\.value \|\| !caseData\.value \|\| !externalUrl\.value/);
    assert.match(source, /usePortfolioAnimations\(root\);/);
    assert.match(source, /usePortfolioHead\('u2'\);/);
});

test('localized U2 route wrappers stay thin and case children stay prop-only', () => {
    const wrappers = [
        readFileSync(new URL('../pages/projects/u2.vue', import.meta.url), 'utf8'),
        readFileSync(new URL('../pages/en/projects/u2.vue', import.meta.url), 'utf8'),
    ];
    const childNames = ['CaseHero', 'CaseFacts', 'CaseNarrative', 'CaseGallery', 'CaseResult', 'CaseNavigation'];

    wrappers.forEach((source) => {
        assert.equal(source.trim(), '<template>\n\t<U2CasePage/>\n</template>');
    });

    childNames.forEach((name) => {
        const source = readFileSync(new URL(`../components/case/${ name }.vue`, import.meta.url), 'utf8');
        assert.match(source, /defineProps\(/, `${ name } must declare its inputs`);
        assert.doesNotMatch(source, /useLanguage|portfolioCopy|data\/portfolio\/(?:ru|en)\.json/);
    });
});

test('U2 case evidence renders truthful semantic count surfaces and resilient media', () => {
    const copy = loadCopy();
    const facts = readFileSync(new URL('../components/case/CaseFacts.vue', import.meta.url), 'utf8');
    const narrative = readFileSync(new URL('../components/case/CaseNarrative.vue', import.meta.url), 'utf8');
    const gallery = readFileSync(new URL('../components/case/CaseGallery.vue', import.meta.url), 'utf8');

    for (const locale of ['ru', 'en']) {
        const caseData = copy[locale].projects.find(({id}) => id === 'u2').case;
        assert.equal(caseData.facts.length, 4);
        assert.equal(caseData.narrative.length, 4);
        assert.equal(caseData.gallery.length, 4);
    }

    assert.match(facts, /<dl/);
    assert.match(facts, /data-case-fact/);
    assert.match(facts, /<dt>/);
    assert.match(facts, /<dd>/);

    assert.match(narrative, /<section/);
    assert.match(narrative, /<article[^>]*v-for="item in items"[^>]*:key="item\.id"[^>]*:id="`case-\$\{item\.id\}`"[^>]*data-case-narrative/s);
    assert.doesNotMatch(narrative, /v-html/);

    assert.match(gallery, /<figure[^>]*data-case-media/);
    assert.match(gallery, /<picture/);
    assert.match(gallery, /type="image\/avif"/);
    assert.match(gallery, /:src="item\?\.webp"/);
    assert.match(gallery, /:width="item\?\.width"/);
    assert.match(gallery, /:height="item\?\.height"/);
    assert.match(gallery, /:alt="item\.alt"/);
    assert.match(gallery, /decoding="async"/);
    assert.match(gallery, /:loading="index === 0 \? 'eager' : 'lazy'"/);
    assert.match(gallery, /reactive\(new Set\(\)\)/);
    assert.match(gallery, /@error="markFailed\(item, index\)"/);
    assert.match(gallery, /class="case-media__fallback" aria-hidden="true"/);
});

test('U2 gallery exposes its visible caption to assistive technology after media failure', () => {
    const gallery = readFileSync(new URL('../components/case/CaseGallery.vue', import.meta.url), 'utf8');

    assert.match(
        gallery,
        /<figcaption :aria-hidden="hasFailed\(item, index\) \? undefined : 'true'">/,
    );
    assert.doesNotMatch(gallery, /<figcaption aria-hidden="true">/);
});

test('U2 case hero, result, and navigation preserve media and safe-link contracts', () => {
    const hero = readFileSync(new URL('../components/case/CaseHero.vue', import.meta.url), 'utf8');
    const result = readFileSync(new URL('../components/case/CaseResult.vue', import.meta.url), 'utf8');
    const navigation = readFileSync(new URL('../components/case/CaseNavigation.vue', import.meta.url), 'utf8');

    assert.match(hero, /<h1[^>]*>\{\{ project\.name \}\}<\/h1>/);
    assert.match(hero, /caseData\.eyebrow/);
    assert.match(hero, /caseData\.summary/);
    assert.match(hero, /project\.teaserMedia\.avif/);
    assert.match(hero, /type="image\/avif"/);
    assert.match(hero, /project\.teaserMedia\.webp/);
    assert.match(hero, /:width="project\.teaserMedia\.width"/);
    assert.match(hero, /:height="project\.teaserMedia\.height"/);
    assert.match(hero, /:alt="project\.teaserMedia\.alt"/);
    assert.match(hero, /fetchpriority="high"/);
    assert.match(hero, /decoding="async"/);
    assert.match(hero, /target="_blank"/);
    assert.match(hero, /rel="noreferrer"/);

    assert.match(result, /\{\{ result \}\}/);
    assert.match(result, /v-for="technology in technologies"/);
    assert.doesNotMatch(result, /\d+%|\d+x/i);

    assert.match(navigation, /<NuxtLink :to="homePath">/);
    assert.match(navigation, /caseData\.backLabel/);
    assert.match(navigation, /caseData\.externalLabel/);
    assert.match(navigation, /caseData\.nextLabel/);
    assert.match(navigation, /https:\/\/novaya\.ru\//);
    assert.equal(navigation.match(/target="_blank"/g)?.length, 2);
    assert.equal(navigation.match(/rel="noreferrer"/g)?.length, 2);
});
