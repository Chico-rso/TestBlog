<template>
    <section class="hero" aria-labelledby="hero-title">
        <div class="hero__glow"></div>
        <div class="hero__grid"></div>
        <div class="container hero__inner">
            <div class="hero__content">
                <p class="hero__eyebrow">{{ copy.hero.eyebrow }}</p>
                <h1 id="hero-title" class="hero__title">
                    <span>{{ copy.hero.name }}</span>
                    <em>{{ copy.hero.role }}</em>
                </h1>
                <p class="hero__subtitle">{{ copy.hero.subtitle }}</p>
                <div class="hero__meta">
                    <span>{{ copy.hero.location }}</span>
                    <span>{{ copy.hero.status }}</span>
                </div>
                <div class="hero__cta">
                    <a class="btn btn--primary" :href="`mailto:${email}`">{{ copy.hero.ctaPrimary }}</a>
                    <a class="btn btn--ghost" :href="`https://t.me/${telegram}`" target="_blank" rel="noreferrer">
                        {{ copy.hero.ctaSecondary }}
                    </a>
                    <a class="btn btn--ghost btn--download" :href="resumeUrl" download>
                        {{ copy.hero.ctaCv }}
                    </a>
                </div>
            </div>
            <div class="hero__stats">
                <div v-for="stat in copy.stats" :key="stat.label" class="stat-card">
                    <div class="stat-card__value">{{ stat.value }}</div>
                    <div class="stat-card__label">{{ stat.label }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    copy: {type: Object, required: true},
    email: {type: String, required: true},
    telegram: {type: String, required: true},
    resumeUrl: {type: String, required: true},
});
</script>
