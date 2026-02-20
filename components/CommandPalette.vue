<template>
    <Teleport to="body">
        <div v-if="isOpen" class="command-overlay" @click="close">
            <section class="command-panel" role="dialog" aria-modal="true"
                     :aria-label="lang === 'ru' ? 'Командная палитра' : 'Command palette'"
                     @click.stop>
                <header class="command-panel__head">
                    <h2>{{ lang === 'ru' ? 'Быстрая навигация' : 'Quick navigation' }}</h2>
                    <button type="button" @click="close" aria-label="Close">Esc</button>
                </header>
                <ul class="command-list" role="list">
                    <li v-for="item in items" :key="item.id">
                        <button type="button" @click="goTo(item.id)">
                            <span>{{ item.label }}</span>
                            <kbd>#{{ item.id }}</kbd>
                        </button>
                    </li>
                </ul>
            </section>
        </div>
    </Teleport>
</template>

<script setup>
const {lang} = useLanguage();
const isOpen = ref(false);

const items = computed(() => {
    if (lang.value === 'ru') {
        return [
            {id: 'profile', label: 'Профиль инженера'},
            {id: 'approach', label: 'Системный подход'},
            {id: 'work', label: 'Продакшн-кейсы'},
            {id: 'stack', label: 'Технологический стек'},
            {id: 'principles', label: 'Инженерные принципы'},
            {id: 'contact', label: 'Контакт'},
        ];
    }

    return [
        {id: 'profile', label: 'Engineering profile'},
        {id: 'approach', label: 'System approach'},
        {id: 'work', label: 'Production cases'},
        {id: 'stack', label: 'Tech stack'},
        {id: 'principles', label: 'Principles'},
        {id: 'contact', label: 'Contact'},
    ];
});

const close = () => {
    isOpen.value = false;
};

const open = () => {
    isOpen.value = true;
};

const goTo = (id) => {
    const node = document.getElementById(id);
    if (node) {
        node.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    close();
};

const onKeyDown = (event) => {
    const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    if (isShortcut) {
        event.preventDefault();
        isOpen.value = !isOpen.value;
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

    button {
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
    .command-list button:hover {
        border-color: color-mix(in srgb, var(--portfolio-accent) 35%, var(--portfolio-border));
        background: color-mix(in srgb, var(--portfolio-accent) 8%, transparent);
        transform: translateX(2px);
    }
}
</style>
