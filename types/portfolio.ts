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
    work: string;
    experience: string;
    skills: string;
    about: string;
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
    work: PortfolioSectionCopy;
    experience: PortfolioSectionCopy;
    skills: PortfolioSectionCopy;
    about: PortfolioSectionCopy;
};

export type PortfolioProjectLink = {
    label: string;
    url: string;
};

export type PortfolioProject = {
    name: string;
    type: string;
    description: string;
    tags: string[];
    links: PortfolioProjectLink[];
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
    email: string;
    telegram: string;
    resumeUrl: string;
};
