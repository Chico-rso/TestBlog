const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(`[portfolio] ${ message }`);
    }
};

const assertString = (value, path) => {
    assert(typeof value === 'string', `${ path } must be a string`);
    assert(value.trim().length > 0, `${ path } must be non-empty`);
};

const assertBoolean = (value, path) => {
    assert(typeof value === 'boolean', `${ path } must be a boolean`);
};

const assertPositiveNumber = (value, path) => {
    assert(typeof value === 'number' && Number.isFinite(value) && value > 0, `${ path } must be a positive number`);
};

const assertStringArray = (value, path) => {
    assert(Array.isArray(value), `${ path } must be an array`);
    value.forEach((item, index) => assertString(item, `${ path }[${ index }]`));
};

const assertObject = (value, path) => {
    assert(isObject(value), `${ path } must be an object`);
};

const validateMedia = (media, path) => {
    assertObject(media, path);
    assertString(media.avif, `${ path }.avif`);
    assertString(media.webp, `${ path }.webp`);
    assertString(media.alt, `${ path }.alt`);
    assertPositiveNumber(media.width, `${ path }.width`);
    assertPositiveNumber(media.height, `${ path }.height`);
};

const u2MediaContract = [
    {stem: 'u2-home-desktop', width: 1600, height: 1000},
    {stem: 'u2-filters-desktop', width: 1600, height: 1000},
    {stem: 'u2-flat-desktop', width: 1600, height: 1000},
    {stem: 'u2-filters-mobile', width: 780, height: 1688},
];

const validateU2Media = (media, path, expectedMedia) => {
    validateMedia(media, path);
    assert(
        media.avif === `/projects/u2/${ expectedMedia.stem }.avif`,
        `${ path }.avif must match the canonical U2 media path`,
    );
    assert(
        media.webp === `/projects/u2/${ expectedMedia.stem }.webp`,
        `${ path }.webp must match the canonical U2 media path`,
    );
    assert(media.width === expectedMedia.width, `${ path }.width must match the canonical U2 media dimensions`);
    assert(media.height === expectedMedia.height, `${ path }.height must match the canonical U2 media dimensions`);
};

const validateU2Case = (project, locale, base) => {
    const expectedCasePath = locale === 'ru' ? '/projects/u2' : '/en/projects/u2';
    assertString(project.casePath, `${ base }.casePath`);
    assert(project.casePath === expectedCasePath, `${ base }.casePath must be "${ expectedCasePath }"`);
    validateU2Media(project.teaserMedia, `${ base }.teaserMedia`, u2MediaContract[0]);
    assert(
        project.links?.[0]?.url === 'https://u2.moscow/',
        `${ base }.links[0].url must be the canonical public U2 URL`,
    );

    const caseData = project.case;
    assertObject(caseData, `${ base }.case`);
    ['eyebrow', 'summary', 'result', 'backLabel', 'externalLabel', 'nextLabel'].forEach((key) => {
        assertString(caseData[key], `${ base }.case.${ key }`);
    });

    assert(Array.isArray(caseData.facts), `${ base }.case.facts must be an array`);
    assert(caseData.facts.length === 4, `${ base }.case.facts must contain exactly 4 items`);
    caseData.facts.forEach((fact, index) => {
        assertObject(fact, `${ base }.case.facts[${ index }]`);
        assertString(fact.label, `${ base }.case.facts[${ index }].label`);
        assertString(fact.value, `${ base }.case.facts[${ index }].value`);
    });

    assert(Array.isArray(caseData.narrative), `${ base }.case.narrative must be an array`);
    assert(caseData.narrative.length === 4, `${ base }.case.narrative must contain exactly 4 items`);
    const narrativeIds = new Set();
    const requiredNarrativeIds = ['task', 'contribution', 'approach', 'result'];
    const requiredNarrativeIdSet = new Set(requiredNarrativeIds);
    caseData.narrative.forEach((item, index) => {
        const itemPath = `${ base }.case.narrative[${ index }]`;
        assertObject(item, itemPath);
        assertString(item.id, `${ itemPath }.id`);
        assert(requiredNarrativeIdSet.has(item.id), `${ itemPath }.id must be a U2 narrative id`);
        assert(!narrativeIds.has(item.id), `${ base }.case.narrative contains duplicate id "${ item.id }"`);
        narrativeIds.add(item.id);
        assertString(item.title, `${ itemPath }.title`);
        assertString(item.text, `${ itemPath }.text`);
    });
    requiredNarrativeIds.forEach((id) => {
        assert(narrativeIds.has(id), `${ base }.case.narrative must contain id "${ id }"`);
    });
    assert(
        caseData.narrative.every((item, index) => item.id === requiredNarrativeIds[index]),
        `${ base }.case.narrative must match the U2 narrative order`,
    );

    assert(Array.isArray(caseData.gallery), `${ base }.case.gallery must be an array`);
    assert(caseData.gallery.length === 4, `${ base }.case.gallery must contain exactly 4 items`);
    caseData.gallery.forEach((media, index) => {
        validateU2Media(media, `${ base }.case.gallery[${ index }]`, u2MediaContract[index]);
    });

    assertStringArray(caseData.technologies, `${ base }.case.technologies`);
    const requiredTechnologies = ['Vue', 'Nuxt', 'TypeScript', 'GSAP', 'SCSS', 'SSR'];
    assert(
        caseData.technologies.length === requiredTechnologies.length
            && caseData.technologies.every((technology, index) => technology === requiredTechnologies[index]),
        `${ base }.case.technologies must match the U2 technology contract`,
    );
};

const validateLinks = (links, path) => {
    assert(Array.isArray(links), `${ path } must be an array`);
    links.forEach((link, index) => {
        assertObject(link, `${ path }[${ index }]`);
        assertString(link.label, `${ path }[${ index }].label`);
        assertString(link.url, `${ path }[${ index }].url`);
    });
};

const validateLocale = (data, locale) => {
    assertObject(data, `${ locale }`);
    
    assertObject(data.meta, `${ locale }.meta`);
    assertString(data.meta.title, `${ locale }.meta.title`);
    assertString(data.meta.description, `${ locale }.meta.description`);
    
    assertObject(data.labels, `${ locale }.labels`);
    assertString(data.labels.website, `${ locale }.labels.website`);
    assertString(data.labels.nda, `${ locale }.labels.nda`);
    
    assertObject(data.nav, `${ locale }.nav`);
    ['experience', 'u2', 'projects', 'stack', 'contact'].forEach((key) => {
        assertString(data.nav[key], `${ locale }.nav.${ key }`);
    });
    
    assertObject(data.hero, `${ locale }.hero`);
    ['eyebrow', 'name', 'role', 'subtitle', 'status', 'location', 'ctaPrimary', 'ctaSecondary', 'ctaCv'].forEach((key) => {
        assertString(data.hero[key], `${ locale }.hero.${ key }`);
    });
    
    assert(Array.isArray(data.stats), `${ locale }.stats must be an array`);
    data.stats.forEach((stat, index) => {
        assertObject(stat, `${ locale }.stats[${ index }]`);
        assertString(stat.value, `${ locale }.stats[${ index }].value`);
        assertString(stat.label, `${ locale }.stats[${ index }].label`);
    });
    
    assertObject(data.sections, `${ locale }.sections`);
    ['featured', 'experience', 'projects', 'skills', 'principles'].forEach((key) => {
        assertObject(data.sections[key], `${ locale }.sections.${ key }`);
        assertString(data.sections[key].title, `${ locale }.sections.${ key }.title`);
        assertString(data.sections[key].subtitle, `${ locale }.sections.${ key }.subtitle`);
    });
    
    assert(Array.isArray(data.projects), `${ locale }.projects must be an array`);
    const projectIds = new Set();
    const projectUrls = new Set();
    const featuredProjects = [];
    data.projects.forEach((project, index) => {
        const base = `${ locale }.projects[${ index }]`;
        assertObject(project, base);
        assertString(project.id, `${ base }.id`);
        assert(!projectIds.has(project.id), `${ locale }.projects contains duplicate id "${ project.id }"`);
        projectIds.add(project.id);
        assertString(project.name, `${ base }.name`);
        assertString(project.type, `${ base }.type`);
        assertString(project.description, `${ base }.description`);
        assertBoolean(project.featured, `${ base }.featured`);
        if (project.featured) {
            featuredProjects.push({project, base});
        }
        if (project.casePath !== undefined) {
            assertString(project.casePath, `${ base }.casePath`);
        }
        if (project.teaserMedia !== undefined) {
            validateMedia(project.teaserMedia, `${ base }.teaserMedia`);
        }
        if (project.case !== undefined) {
            assertObject(project.case, `${ base }.case`);
        }
        assertStringArray(project.tags, `${ base }.tags`);
        assertStringArray(project.contributions, `${ base }.contributions`);
        assert(project.contributions.length > 0, `${ base }.contributions must be non-empty`);
        validateLinks(project.links, `${ base }.links`);
        project.links.forEach((link) => {
            assert(!projectUrls.has(link.url), `${ locale }.projects contains duplicate URL "${ link.url }"`);
            projectUrls.add(link.url);
        });
    });
    assert(featuredProjects.length === 1, `${ locale }.projects must contain exactly one featured project`);
    assert(featuredProjects[0].project.id === 'u2', `${ locale }.featured project must have id "u2"`);
    validateU2Case(featuredProjects[0].project, locale, featuredProjects[0].base);
    
    assert(Array.isArray(data.experience), `${ locale }.experience must be an array`);
    data.experience.forEach((item, index) => {
        const base = `${ locale }.experience[${ index }]`;
        assertObject(item, base);
        assertString(item.company, `${ base }.company`);
        assertString(item.role, `${ base }.role`);
        assertString(item.period, `${ base }.period`);
        assertString(item.stack, `${ base }.stack`);
        assertStringArray(item.bullets, `${ base }.bullets`);
    });
    
    assert(Array.isArray(data.skills), `${ locale }.skills must be an array`);
    data.skills.forEach((skill, index) => {
        const base = `${ locale }.skills[${ index }]`;
        assertObject(skill, base);
        assertString(skill.group, `${ base }.group`);
        assertStringArray(skill.items, `${ base }.items`);
    });
    
    assertObject(data.footer, `${ locale }.footer`);
    ['title', 'subtitle', 'emailLabel', 'telegramLabel', 'locationLabel'].forEach((key) => {
        assertString(data.footer[key], `${ locale }.footer.${ key }`);
    });
};

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
