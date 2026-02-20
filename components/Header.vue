<template>
    <header class="site-header">
        <div class="container site-header__inner">
            <a class="brand" href="#top" :aria-label="lang === 'ru' ? 'Домой' : 'Home'" @click.prevent="scrollToTop">
                <span>AB</span>
            </a>
            <nav class="site-nav" :aria-label="lang === 'ru' ? 'Основная навигация' : 'Primary navigation'">
                <a v-for="item in navItems" :key="item.id" :href="`#${item.id}`"
                   :class="{ active: activeSection === item.id }"
                   :aria-current="activeSection === item.id ? 'location' : undefined">{{ item.label }}</a>
            </nav>
            <div class="site-actions site-actions--desktop">
                <button class="command-toggle" type="button" @click="openCommandPalette"
                        :aria-label="lang === 'ru' ? 'Открыть командную палитру' : 'Open command palette'">
                    <span>{{ lang === 'ru' ? 'Команды' : 'Command' }}</span>
                    <kbd>⌘K</kbd>
                </button>
                <button class="theme-toggle" type="button" @click="toggleTheme"
                        :aria-label="theme === 'dark'
                            ? (lang === 'ru' ? 'Переключить на светлую тему' : 'Switch to light theme')
                            : (lang === 'ru' ? 'Переключить на тёмную тему' : 'Switch to dark theme')">
                    <span class="theme-toggle__track" :class="{ 'is-dark': theme === 'dark' }">
                        <span class="theme-toggle__thumb"></span>
                    </span>
                    <span class="theme-toggle__text">
                        {{ theme === 'dark' ? (lang === 'ru' ? 'Тёмная' : 'Dark') : (lang === 'ru' ? 'Светлая' : 'Light') }}
                    </span>
                </button>
                <button class="lang-toggle" type="button" @click="toggleLang"
                        :aria-label="lang === 'ru' ? 'Сменить язык' : 'Toggle language'">
                    <span :class="{ active: lang === 'ru' }">RU</span>
                    <span>/</span>
                    <span :class="{ active: lang === 'en' }">EN</span>
                </button>
                <a class="contact-pill" :href="`https://t.me/${telegram}`" target="_blank" rel="noreferrer">
                    {{ lang === 'ru' ? 'Телеграм' : 'Telegram' }}
                </a>
            </div>
            <div class="site-actions site-actions--mobile">
                <button class="lang-toggle" type="button" @click="toggleLang"
                        :aria-label="lang === 'ru' ? 'Сменить язык' : 'Toggle language'">
                    <span :class="{ active: lang === 'ru' }">RU</span>
                    <span>/</span>
                    <span :class="{ active: lang === 'en' }">EN</span>
                </button>
                <button class="burger-toggle" type="button" :class="{ 'is-open': isMenuOpen }"
                        :aria-expanded="isMenuOpen" :aria-label="isMenuOpen ? closeLabel : openLabel"
                        @click="toggleMobileMenu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>
    <Transition name="menu-fade">
        <div v-if="isMenuOpen" class="mobile-menu-backdrop" @click="closeMobileMenu"></div>
    </Transition>
    <Transition name="menu-slide">
        <aside v-if="isMenuOpen" class="mobile-menu" role="dialog" aria-modal="true"
              :aria-label="lang === 'ru' ? 'Мобильное меню' : 'Mobile menu'">
            <div class="mobile-menu__head">
                <strong>{{ lang === 'ru' ? 'Навигация' : 'Navigation' }}</strong>
                <button type="button" class="mobile-menu__close" :aria-label="closeLabel" @click="closeMobileMenu">Esc</button>
            </div>
            <nav class="mobile-nav" :aria-label="lang === 'ru' ? 'Мобильная навигация' : 'Mobile navigation'">
                <a v-for="item in navItems" :key="item.id" :href="`#${item.id}`"
                   :class="{ active: activeSection === item.id }"
                   @click.prevent="scrollToSection(item.id)">
                    {{ item.label }}
                </a>
            </nav>
            <div class="mobile-actions">
                <button class="command-toggle command-toggle--mobile" type="button" @click="openCommandPaletteFromMenu"
                        :aria-label="lang === 'ru' ? 'Открыть командную палитру' : 'Open command palette'">
                    <span>{{ lang === 'ru' ? 'Команды' : 'Command' }}</span>
                    <kbd>⌘K</kbd>
                </button>
                <button class="theme-toggle theme-toggle--mobile" type="button" @click="toggleTheme"
                        :aria-label="theme === 'dark'
                            ? (lang === 'ru' ? 'Переключить на светлую тему' : 'Switch to light theme')
                            : (lang === 'ru' ? 'Переключить на тёмную тему' : 'Switch to dark theme')">
                    <span class="theme-toggle__track" :class="{ 'is-dark': theme === 'dark' }">
                        <span class="theme-toggle__thumb"></span>
                    </span>
                    <span class="theme-toggle__text">
                        {{ theme === 'dark' ? (lang === 'ru' ? 'Тёмная' : 'Dark') : (lang === 'ru' ? 'Светлая' : 'Light') }}
                    </span>
                </button>
                <a class="contact-pill contact-pill--mobile" :href="`https://t.me/${telegram}`" target="_blank"
                   rel="noreferrer" @click="closeMobileMenu">
                    {{ lang === 'ru' ? 'Телеграм' : 'Telegram' }}
                </a>
            </div>
        </aside>
    </Transition>
</template>

<script setup>
import { portfolioConfig } from '~/data/portfolioConfig.js';

const {lang, toggleLang} = useLanguage();
const {theme, toggleTheme} = useTheme();
const {activeSection} = useActiveSection(['profile', 'approach', 'work', 'stack', 'principles', 'contact']);
const {telegram} = portfolioConfig;
const isMenuOpen = ref(false);

const openLabel = computed(() => (lang.value === 'ru' ? 'Открыть меню' : 'Open menu'));
const closeLabel = computed(() => (lang.value === 'ru' ? 'Закрыть меню' : 'Close menu'));

const navItems = computed(() => {
    if (lang.value === 'ru') {
        return [
            {id: 'profile', label: 'ПРОФИЛЬ'},
            {id: 'approach', label: 'ПОДХОД'},
            {id: 'work', label: 'КЕЙСЫ'},
            {id: 'stack', label: 'СТЕК'},
            {id: 'principles', label: 'ПРИНЦИПЫ'},
            {id: 'contact', label: 'КОНТАКТ'},
        ];
    }
    
    return [
        {id: 'profile', label: 'PROFILE'},
        {id: 'approach', label: 'APPROACH'},
        {id: 'work', label: 'CASES'},
        {id: 'stack', label: 'STACK'},
        {id: 'principles', label: 'PRINCIPLES'},
        {id: 'contact', label: 'CONTACT'},
    ];
});

const scrollToTop = () => {
    if (typeof window === 'undefined') {
        return;
    }
    closeMobileMenu();
    window.scrollTo({top: 0, behavior: 'smooth'});
};

const scrollToSection = (id) => {
    if (typeof window === 'undefined') {
        return;
    }
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    closeMobileMenu();
};

const toggleMobileMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMobileMenu = () => {
    isMenuOpen.value = false;
};

const onEscape = (event) => {
    if (event.key === 'Escape') {
        closeMobileMenu();
    }
};

const onResize = () => {
    if (window.innerWidth > 1120) {
        closeMobileMenu();
    }
};

const openCommandPalette = () => {
    if (typeof window === 'undefined') {
        return;
    }
    window.dispatchEvent(new Event('portfolio:command-open'));
};

const openCommandPaletteFromMenu = () => {
    closeMobileMenu();
    openCommandPalette();
};

watch(isMenuOpen, (isOpen) => {
    if (typeof document === 'undefined') {
        return;
    }
    document.body.classList.toggle('menu-open', isOpen);
});

onMounted(() => {
    window.addEventListener('keydown', onEscape);
    window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onEscape);
    window.removeEventListener('resize', onResize);
    if (typeof document !== 'undefined') {
        document.body.classList.remove('menu-open');
    }
});
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
    font-size: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
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

.site-actions--mobile {
    display: none;
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

.command-toggle {
    border: 1px solid var(--portfolio-border);
    border-radius: 10px;
    padding: 6px 10px;
    background: var(--portfolio-surface);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: var(--portfolio-muted);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    transition: border-color 0.2s linear, color 0.2s linear;

    kbd {
        border: 1px solid var(--portfolio-border);
        border-radius: 6px;
        padding: 2px 6px;
        font-size: 11px;
        color: var(--portfolio-title);
        background: var(--portfolio-surface-strong);
    }
}

@media (hover: hover) {
    .command-toggle:hover {
        border-color: color-mix(in srgb, var(--portfolio-accent) 40%, var(--portfolio-border));
        color: var(--portfolio-title);
    }
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
    font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    text-transform: uppercase;
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
    border-radius: 12px;
    background: var(--portfolio-accent);
    color: #04141a;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    box-shadow: 0 12px 24px var(--portfolio-shadow-strong);
}

.burger-toggle {
    width: 42px;
    height: 42px;
    border: 1px solid var(--portfolio-border);
    border-radius: 12px;
    background: var(--portfolio-surface);
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    padding: 0 10px;
    cursor: pointer;

    span {
        height: 2px;
        width: 100%;
        background: var(--portfolio-title);
        border-radius: 999px;
        transition: transform 0.2s linear, opacity 0.2s linear;
    }
}

.burger-toggle.is-open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}

.burger-toggle.is-open span:nth-child(2) {
    opacity: 0;
}

.burger-toggle.is-open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}

.mobile-menu-backdrop {
    position: fixed;
    inset: 0;
    background: color-mix(in srgb, #000 50%, var(--portfolio-bg) 50%);
    z-index: 24;
}

.mobile-menu {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(360px, 92vw);
    background: var(--portfolio-surface-strong);
    border-left: 1px solid var(--portfolio-border);
    box-shadow: -20px 0 40px var(--portfolio-shadow-soft);
    z-index: 25;
    padding: 18px 16px max(24px, env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.mobile-menu__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    strong {
        color: var(--portfolio-title);
        font-size: 13px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    }
}

.mobile-menu__close {
    border: 1px solid var(--portfolio-border);
    border-radius: 8px;
    background: var(--portfolio-surface);
    color: var(--portfolio-muted);
    font-size: 11px;
    padding: 4px 9px;
    cursor: pointer;
    text-transform: uppercase;
    font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.mobile-nav {
    display: grid;
    gap: 8px;

    a {
        border: 1px solid var(--portfolio-border);
        border-radius: 10px;
        padding: 10px 12px;
        color: var(--portfolio-text);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 12px;
        font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        background: var(--portfolio-surface);
        transition: border-color 0.2s linear, color 0.2s linear;
    }

    a.active {
        border-color: color-mix(in srgb, var(--portfolio-accent) 45%, var(--portfolio-border));
        color: var(--portfolio-accent);
    }
}

.mobile-actions {
    margin-top: auto;
    display: grid;
    gap: 10px;
}

.command-toggle--mobile,
.theme-toggle--mobile,
.contact-pill--mobile {
    width: 100%;
    justify-content: center;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
    transition: opacity 0.25s linear;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
    opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
    transition: transform 0.25s linear, opacity 0.25s linear;
}

.menu-slide-enter-from,
.menu-slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

@media (max-width: 1120px) {
    .site-nav,
    .site-actions--desktop {
        display: none;
    }

    .site-actions--mobile {
        display: flex;
    }
}

@media (max-width: 720px) {
    .site-header .container {
        padding-left: 16px;
        padding-right: 16px;
    }
}
</style>
