<template>
    <section class="hero" aria-labelledby="hero-title">
        <div class="hero__glow"></div>
        <div class="hero__grid"></div>
        <div class="container hero__inner">
            <div class="hero__content">
                <div class="hero__boot">
                    <p v-for="line in system.boot" :key="line">{{ line }}</p>
                </div>
                <p class="hero__eyebrow">{{ system.stack }}</p>
                <h1 id="hero-title" class="hero__title">
                    <span class="hero__title-reveal">
                        <span class="hero__title-main">{{ system.title }}</span>
                    </span>
                    <span class="hero__title-reveal">
                        <em class="hero__title-role">{{ system.lead }}</em>
                    </span>
                </h1>
                <p class="hero__subtitle">{{ copy.hero.subtitle }}</p>
                <div class="hero__meta">
                    <span>{{ copy.hero.location }}</span>
                    <span>{{ copy.hero.status }}</span>
                </div>
                <div class="hero__cta">
                    <a class="btn btn--primary" href="#work">{{ system.ctaPrimary }}</a>
                    <a class="btn btn--ghost" href="#contact">{{ system.ctaSecondary }}</a>
                </div>
                <p v-if="system.commandHint" class="hero__command-hint">{{ system.commandHint }}</p>
            </div>
            <div class="hero__visual" aria-hidden="true">
                <div class="hero__orb hero__orb--main"></div>
                <div class="hero__orb hero__orb--accent"></div>
                <div class="hero__ring hero__ring--one"></div>
                <div class="hero__ring hero__ring--two"></div>
                <div class="hero__signal hero__signal--one"></div>
                <div class="hero__signal hero__signal--two"></div>
                <div class="hero__visual-card">
                    <span>{{ copy.stats[1].value }}</span>
                    <span>{{ copy.stats[2].value }}</span>
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
    system: {type: Object, required: true},
});
</script>
