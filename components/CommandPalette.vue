<template>
    <Teleport to="body">
        <div v-if="isOpen" class="command-overlay" @click="close">
            <section ref="palettePanel" class="command-panel" role="dialog" aria-modal="true" tabindex="-1"
                     :aria-label="lang === 'ru' ? 'Командная палитра' : 'Command palette'"
                     @click.stop @keydown="trapFocus($event, palettePanel)">
                <header class="command-panel__head">
                    <h2>{{ lang === 'ru' ? 'Быстрая навигация' : 'Quick navigation' }}</h2>
                    <button ref="closeButton" type="button" @click="close" :aria-label="lang === 'ru' ? 'Закрыть' : 'Close'">Esc</button>
                </header>
                <ul class="command-list" role="list">
                    <li v-for="item in items" :key="item.id">
                        <NuxtLink class="command-link" :to="sectionTarget(item.id)" @click="goTo($event, item.id)">
                            <span>{{ item.label }}</span>
                            <kbd>#{{ item.id }}</kbd>
                        </NuxtLink>
                    </li>
                </ul>
            </section>
        </div>
    </Teleport>
</template>

<script setup>
import {portfolioRoutes} from '~/lib/portfolio/routes.js';

const {t, lang} = useLanguage();
const route = useRoute();
const isOpen = ref(false);
const opener = ref(null);
const palettePanel = ref(null);
const closeButton = ref(null);
const navigationIds = ['experience', 'u2', 'projects', 'stack', 'contact'];
const homePath = computed(() => portfolioRoutes[lang.value].home);
const isHomeRoute = computed(() => route.path === homePath.value);
const sectionTarget = (id) => `${homePath.value}#${id}`;
const isPlainPrimaryClick = (event) => !(event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const items = computed(() => navigationIds.map((id) => ({id, label: t.value.nav[id]})));

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

const close = (restoreFocus = true) => {
    const wasOpen = isOpen.value;
    const restoreTarget = opener.value;
    isOpen.value = false;
    opener.value = null;

    if (wasOpen && restoreFocus && restoreTarget?.isConnected) {
        nextTick(() => restoreTarget?.isConnected && restoreTarget.focus());
    }
};

const open = (event) => {
    const candidate = event?.detail?.opener;
    opener.value = candidate?.isConnected
        ? candidate
        : (typeof document === 'undefined' ? null : document.activeElement);
    isOpen.value = true;
    nextTick(() => closeButton.value?.focus());
};

const goTo = (event, id) => {
    if (!isPlainPrimaryClick(event) || !isHomeRoute.value || typeof document === 'undefined') {
        return;
    }

    const node = document.getElementById(id);
    if (!node) {
        return;
    }

    event.preventDefault();
    node.scrollIntoView({behavior: 'smooth', block: 'start'});
    close();
};

const onKeyDown = (event) => {
    const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    if (isShortcut) {
        event.preventDefault();
        if (isOpen.value) {
            close();
        } else {
            open();
        }
        return;
    }

    if (event.key === 'Escape' && isOpen.value) {
        close();
    }
};

onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('portfolio:command-open', open);
});

watch(
    () => route.fullPath,
    () => close(),
);

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('portfolio:command-open', open);
});
</script>

<style lang="scss" scoped>
.command-overlay {
    position: fixed;
    inset: 0;
    background: color-mix(in srgb, var(--portfolio-bg) 40%, #000 60%);
    backdrop-filter: blur(8px);
    z-index: 80;
    display: grid;
    place-items: start center;
    padding: 90px 16px 24px;
}

.command-panel {
    width: min(640px, 100%);
    border: 1px solid color-mix(in srgb, var(--portfolio-accent) 32%, var(--portfolio-border));
    border-radius: 16px;
    background: var(--portfolio-surface-strong);
    box-shadow: 0 20px 60px var(--portfolio-shadow-soft);
    overflow: hidden;
}

.command-panel__head {
    padding: 16px;
    border-bottom: 1px solid var(--portfolio-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    h2 {
        margin: 0;
        font-size: 15px;
        color: var(--portfolio-title);
        text-transform: uppercase;
        letter-spacing: 0.8px;
        font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    }

    button {
        border: 1px solid var(--portfolio-border);
        border-radius: 8px;
        padding: 4px 8px;
        font-size: 11px;
        background: var(--portfolio-surface);
        color: var(--portfolio-muted);
        font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        text-transform: uppercase;
        cursor: pointer;
    }
}

.command-list {
    list-style: none;
    margin: 0;
    padding: 10px;
    display: grid;
    gap: 6px;

    .command-link {
        width: 100%;
        border: 1px solid transparent;
        background: transparent;
        border-radius: 10px;
        padding: 11px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        color: var(--portfolio-text);
        cursor: pointer;
        transition: border-color 0.2s linear, background 0.2s linear, transform 0.2s linear;
    }

    kbd {
        border: 1px solid var(--portfolio-border);
        border-radius: 7px;
        padding: 4px 8px;
        color: var(--portfolio-muted);
        font-size: 11px;
        font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    }
}

@media (hover: hover) {
    .command-list .command-link:hover {
        border-color: color-mix(in srgb, var(--portfolio-accent) 35%, var(--portfolio-border));
        background: color-mix(in srgb, var(--portfolio-accent) 8%, transparent);
        transform: translateX(2px);
    }
}
</style>
