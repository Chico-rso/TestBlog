<template>
    <header class="site-header">
        <div class="container site-header__inner">
            <a class="brand" href="#top" aria-label="Home" @click.prevent="scrollToTop">
                <span>AB</span>
            </a>
            <nav class="site-nav" aria-label="Primary">
                <a href="#work" :class="{ active: activeSection === 'work' }"
                   :aria-current="activeSection === 'work' ? 'location' : undefined">{{ t.nav.work }}</a>
                <a href="#experience" :class="{ active: activeSection === 'experience' }"
                   :aria-current="activeSection === 'experience' ? 'location' : undefined">{{ t.nav.experience }}</a>
                <a href="#skills" :class="{ active: activeSection === 'skills' }"
                   :aria-current="activeSection === 'skills' ? 'location' : undefined">{{ t.nav.skills }}</a>
                <a href="#about" :class="{ active: activeSection === 'about' }"
                   :aria-current="activeSection === 'about' ? 'location' : undefined">{{ t.nav.about }}</a>
                <a href="#contact" :class="{ active: activeSection === 'contact' }"
                   :aria-current="activeSection === 'contact' ? 'location' : undefined">{{ t.nav.contact }}</a>
            </nav>
            <div class="site-actions">
                <button class="theme-toggle" type="button" @click="toggleTheme"
                        :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'">
                    <span class="theme-toggle__track" :class="{ 'is-dark': theme === 'dark' }">
                        <span class="theme-toggle__thumb"></span>
                    </span>
                    <span class="theme-toggle__text">{{ theme === 'dark' ? 'Dark' : 'Light' }}</span>
                </button>
                <button class="lang-toggle" type="button" @click="toggleLang" aria-label="Toggle language">
                    <span :class="{ active: lang === 'ru' }">RU</span>
                    <span>/</span>
                    <span :class="{ active: lang === 'en' }">EN</span>
                </button>
                <a class="contact-pill" :href="`https://t.me/${telegram}`" target="_blank" rel="noreferrer">
                    Telegram
                </a>
            </div>
        </div>
    </header>
</template>

<script setup>
import { portfolioConfig } from '~/data/portfolioConfig.js';

const {lang, t, toggleLang} = useLanguage();
const {theme, toggleTheme} = useTheme();
const {activeSection} = useActiveSection(['work', 'experience', 'skills', 'about', 'contact']);
const {telegram} = portfolioConfig;

const scrollToTop = () => {
    if (typeof window === 'undefined') {
        return;
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
};
</script>

<style lang="scss" scoped>
.site-header {
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(14px);
    background: var(--portfolio-header-bg);
    border-bottom: 1px solid var(--portfolio-border);
}

.site-header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 16px 28px;

    @media (max-width: $tablet) {
        padding: 16px 24px;
    }

    @media (max-width: $desktop) {
        padding: 16px;
    }
}

.brand {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(140deg, var(--portfolio-accent), var(--portfolio-accent-2));
    color: #fff;
    font-weight: 700;
    letter-spacing: 1px;
    box-shadow: 0 10px 24px var(--portfolio-shadow-strong);
}

.site-nav {
    display: none;
    gap: 18px;
    font-size: 14px;
    color: var(--portfolio-muted);

    a {
        transition: color 0.2s ease;
        position: relative;
    }

    a:hover {
        color: var(--portfolio-accent);
    }

    a.active {
        color: var(--portfolio-text);
    }

    a.active::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -6px;
        height: 2px;
        border-radius: 999px;
        background: var(--portfolio-accent);
    }

    @media (min-width: $tablet) {
        display: flex;
    }
}

.site-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.theme-toggle {
    border: 1px solid var(--portfolio-border);
    border-radius: 999px;
    padding: 5px 10px;
    background: var(--portfolio-surface);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.theme-toggle__track {
    width: 34px;
    height: 18px;
    border-radius: 999px;
    background: rgba(15, 123, 255, 0.25);
    position: relative;
    transition: background 0.25s ease;
}

.theme-toggle__track.is-dark {
    background: rgba(255, 139, 105, 0.35);
}

.theme-toggle__thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    background: var(--portfolio-accent);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    transition: transform 0.25s ease, background 0.25s ease;
}

.theme-toggle__track.is-dark .theme-toggle__thumb {
    transform: translateX(16px);
    background: var(--portfolio-accent-2);
}

.theme-toggle__text {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.4px;
    color: var(--portfolio-muted);
}

.lang-toggle {
    border: 1px solid var(--portfolio-border);
    border-radius: 999px;
    padding: 6px 12px;
    background: var(--portfolio-surface);
    font-size: 12px;
    display: flex;
    gap: 6px;
    color: var(--portfolio-muted);
    cursor: pointer;

    span.active {
        color: var(--portfolio-text);
        font-weight: 700;
    }
}

.contact-pill {
    padding: 8px 14px;
    border-radius: 999px;
    background: linear-gradient(140deg, var(--portfolio-accent), var(--portfolio-accent-2));
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 12px 24px var(--portfolio-shadow-strong);
}

@media (max-width: 720px) {
    .site-header .container {
        padding-left: 16px;
        padding-right: 16px;
    }
}
</style>
