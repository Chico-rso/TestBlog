export type Lang = 'ru' | 'en';

export type PortfolioMeta = {
    title: string;
    description: string;
};

export type PortfolioLabels = {
    website: string;
    nda: string;
};

export type PortfolioNav = {
    experience: string;
    u2: string;
    projects: string;
    stack: string;
    contact: string;
};

export type PortfolioHero = {
    eyebrow: string;
    name: string;
    role: string;
    subtitle: string;
    status: string;
    location: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaCv: string;
};

export type PortfolioStat = {
    value: string;
    label: string;
};

export type PortfolioSectionCopy = {
    title: string;
    subtitle: string;
};

export type PortfolioSections = {
    featured: PortfolioSectionCopy;
    experience: PortfolioSectionCopy;
    projects: PortfolioSectionCopy;
    skills: PortfolioSectionCopy;
    principles: PortfolioSectionCopy;
};

export type PortfolioProjectLink = {
    label: string;
    url: string;
};

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

export type PortfolioProject = {
    id: string;
    name: string;
    type: string;
    description: string;
    tags: string[];
    contributions: string[];
    links: PortfolioProjectLink[];
    featured: boolean;
    casePath?: string;
    teaserMedia?: PortfolioMedia;
    case?: PortfolioCase;
};

export type PortfolioExperience = {
    company: string;
    role: string;
    period: string;
    stack: string;
    bullets: string[];
};

export type PortfolioSkillGroup = {
    group: string;
    items: string[];
};

export type PortfolioFooter = {
    title: string;
    subtitle: string;
    emailLabel: string;
    telegramLabel: string;
    locationLabel: string;
};

export type PortfolioLocaleCopy = {
    meta: PortfolioMeta;
    labels: PortfolioLabels;
    nav: PortfolioNav;
    hero: PortfolioHero;
    stats: PortfolioStat[];
    sections: PortfolioSections;
    projects: PortfolioProject[];
    experience: PortfolioExperience[];
    skills: PortfolioSkillGroup[];
    footer: PortfolioFooter;
};

export type PortfolioCopy = {
    ru: PortfolioLocaleCopy;
    en: PortfolioLocaleCopy;
};

export type PortfolioConfig = {
    siteUrl: string;
    email: string;
    telegram: string;
    resumeUrl: string;
};
