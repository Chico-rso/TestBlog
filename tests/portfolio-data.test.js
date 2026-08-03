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

test('portfolio animation composable scopes pointer motion and cleanup', () => {
    const source = readFileSync(new URL('../composables/usePortfolioAnimations.js', import.meta.url), 'utf8');

    assert.match(source, /setupHeroPointerMotion/);
    assert.match(source, /setupProjectCardMotion/);
    assert.match(source, /setupMagneticButtons/);
    assert.match(source, /cleanupCallbacks\.splice/);
    assert.match(source, /\(hover: hover\) and \(pointer: fine\)/);
});
