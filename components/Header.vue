<template>
    <header class="site-header">
        <div class="container site-header__inner">
            <NuxtLink class="brand" :to="homePath" :aria-label="lang === 'ru' ? 'Домой' : 'Home'" @click="scrollToTop($event)">
                <span>AB</span>
            </NuxtLink>
            <nav class="site-nav" :aria-label="lang === 'ru' ? 'Основная навигация' : 'Primary navigation'">
                <NuxtLink v-for="item in navItems" :key="item.id" :to="sectionTarget(item.id)"
                          :class="{ active: isHomeRoute && activeSection === item.id }"
                          :aria-current="isHomeRoute && activeSection === item.id ? 'location' : undefined"
                          @click="scrollToSection($event, item.id)">{{ item.label }}</NuxtLink>
            </nav>
            <div class="site-actions site-actions--desktop">
                <button class="command-toggle" type="button" @click="openCommandPalette($event)"
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
                <button ref="burgerButton" class="burger-toggle" type="button" :class="{ 'is-open': isMenuOpen }"
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
        <aside v-if="isMenuOpen" ref="mobileMenu" class="mobile-menu" role="dialog" aria-modal="true"
              :aria-label="lang === 'ru' ? 'Мобильное меню' : 'Mobile menu'"
              @keydown="trapFocus($event, mobileMenu)">
            <div class="mobile-menu__head">
                <strong>{{ lang === 'ru' ? 'Навигация' : 'Navigation' }}</strong>
                <button ref="closeButton" type="button" class="mobile-menu__close" :aria-label="closeLabel" @click="closeMobileMenu">Esc</button>
            </div>
            <nav class="mobile-nav" :aria-label="lang === 'ru' ? 'Мобильная навигация' : 'Mobile navigation'">
                <NuxtLink v-for="item in navItems" :key="item.id" :to="sectionTarget(item.id)"
                   :class="{ active: isHomeRoute && activeSection === item.id }"
                   :aria-current="isHomeRoute && activeSection === item.id ? 'location' : undefined"
                   @click="scrollToSection($event, item.id)">
                    {{ item.label }}
                </NuxtLink>
            </nav>
            <div class="mobile-actions">
                <button class="command-toggle command-toggle--mobile" type="button" @click="openCommandPaletteFromMenu($event)"
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
import {portfolioRoutes} from '~/lib/portfolio/routes.js';

const {t, lang, toggleLang} = useLanguage();
const {theme, toggleTheme} = useTheme();
const route = useRoute();
const navigationIds = ['experience', 'u2', 'projects', 'stack', 'contact'];
const {activeSection} = useActiveSection(navigationIds);
const {telegram} = portfolioConfig;
const isMenuOpen = ref(false);
const burgerButton = ref(null);
const closeButton = ref(null);
const mobileMenu = ref(null);

const openLabel = computed(() => (lang.value === 'ru' ? 'Открыть меню' : 'Open menu'));
const closeLabel = computed(() => (lang.value === 'ru' ? 'Закрыть меню' : 'Close menu'));
const homePath = computed(() => portfolioRoutes[lang.value].home);
const isHomeRoute = computed(() => route.path === homePath.value);
const navItems = computed(() => navigationIds.map((id) => ({id, label: t.value.nav[id]})));
const sectionTarget = (id) => `${homePath.value}#${id}`;
const isPlainPrimaryClick = (event) => !(event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const trapFocus = (event, container) => {
    if (event.key !== 'Tab') {
        return;
    }

    const focusableElements = [...(container?.querySelectorAll(focusableSelector) || [])];
    if (!focusableElements.length) {
        event.preventDefault();
        return;
    }

    const currentIndex = focusableElements.indexOf(document.activeElement);
    const nextIndex = event.shiftKey
        ? (currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1)
        : (currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1);

    event.preventDefault();
    focusableElements[nextIndex].focus();
};

const scrollToSection = (event, id) => {
    closeMobileMenu();

    if (!isPlainPrimaryClick(event) || !isHomeRoute.value || typeof document === 'undefined') {
        return;
    }

    const section = document.getElementById(id);
    if (!section) {
        return;
    }

    event.preventDefault();
    section.scrollIntoView({behavior: 'smooth', block: 'start'});
};

const scrollToTop = (event) => {
    if (!isPlainPrimaryClick(event) || !isHomeRoute.value || typeof window === 'undefined') {
        return;
    }

    event.preventDefault();
    if (route.hash) {
        navigateTo(homePath.value, {replace: true});
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
};

const toggleMobileMenu = () => {
    if (isMenuOpen.value) {
        closeMobileMenu();
        return;
    }

    isMenuOpen.value = true;
    nextTick(() => closeButton.value?.focus());
};

const closeMobileMenu = (restoreFocus = true) => {
    const wasMenuOpen = isMenuOpen.value;
    isMenuOpen.value = false;

    if (wasMenuOpen && restoreFocus) {
        nextTick(() => burgerButton.value?.focus());
    }
};

const onEscape = (event) => {
    if (event.key === 'Escape' && isMenuOpen.value) {
        closeMobileMenu();
    }
};

const onResize = () => {
    if (window.innerWidth > 1120) {
        closeMobileMenu();
    }
};

const openCommandPalette = (event, opener = event?.currentTarget) => {
    if (typeof window === 'undefined') {
        return;
    }
    window.dispatchEvent(new CustomEvent('portfolio:command-open', {detail: {opener}}));
};

const openCommandPaletteFromMenu = (event) => {
    closeMobileMenu(false);
    openCommandPalette(event, burgerButton.value);
};

watch(isMenuOpen, (isOpen) => {
    if (typeof document === 'undefined') {
        return;
    }
    document.body.classList.toggle('menu-open', isOpen);
});

watch(
    () => route.fullPath,
    () => closeMobileMenu(),
);

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
