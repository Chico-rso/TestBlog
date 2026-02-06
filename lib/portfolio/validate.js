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

const assertStringArray = (value, path) => {
    assert(Array.isArray(value), `${ path } must be an array`);
    value.forEach((item, index) => assertString(item, `${ path }[${ index }]`));
};

const assertObject = (value, path) => {
    assert(isObject(value), `${ path } must be an object`);
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
    ['work', 'experience', 'skills', 'about', 'contact'].forEach((key) => {
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
    ['work', 'experience', 'skills', 'about'].forEach((key) => {
        assertObject(data.sections[key], `${ locale }.sections.${ key }`);
        assertString(data.sections[key].title, `${ locale }.sections.${ key }.title`);
        assertString(data.sections[key].subtitle, `${ locale }.sections.${ key }.subtitle`);
    });
    
    assert(Array.isArray(data.projects), `${ locale }.projects must be an array`);
    data.projects.forEach((project, index) => {
        const base = `${ locale }.projects[${ index }]`;
        assertObject(project, base);
        assertString(project.name, `${ base }.name`);
        assertString(project.type, `${ base }.type`);
        assertString(project.description, `${ base }.description`);
        assertStringArray(project.tags, `${ base }.tags`);
        validateLinks(project.links, `${ base }.links`);
    });
    
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

export const validatePortfolioCopy = (data) => {
    assertObject(data, 'portfolioCopy');
    validateLocale(data.ru, 'ru');
    validateLocale(data.en, 'en');
    return data;
};
