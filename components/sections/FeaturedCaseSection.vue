<template>
    <section class="section section--featured" aria-labelledby="featured-case-title" data-featured-case="u2">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="featured-case-title">{{ section.title }}</h2>
                <p>{{ section.subtitle }}</p>
            </div>
            <article class="featured-case reveal">
                <picture v-if="project.teaserMedia" class="featured-case__media">
                    <source :srcset="project.teaserMedia.avif" type="image/avif">
                    <img
                        :src="project.teaserMedia.webp"
                        :alt="project.teaserMedia.alt"
                        :width="project.teaserMedia.width"
                        :height="project.teaserMedia.height"
                        fetchpriority="high"
                    >
                </picture>
                <div class="featured-case__content">
                    <p class="featured-case__type">{{ project.type }}</p>
                    <h3>{{ project.name }}</h3>
                    <p>{{ project.description }}</p>
                    <ul class="featured-case__contributions" role="list">
                        <li v-for="item in project.contributions" :key="item">{{ item }}</li>
                    </ul>
                    <ul class="work-card__tags" role="list">
                        <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
                    </ul>
                    <div class="featured-case__links">
                        <NuxtLink :to="project.casePath" class="btn btn--primary">
                            {{ project.case.eyebrow }}
                        </NuxtLink>
                        <a
                            v-if="project.links?.[0]"
                            :href="project.links[0].url"
                            class="btn btn--ghost"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {{ project.links[0].label }}
                        </a>
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>

<script setup>
defineProps({
    project: {type: Object, required: true},
    section: {type: Object, required: true},
});
</script>

<style scoped lang="scss">
.featured-case {
    display: grid;
    gap: 24px;
    padding: clamp(18px, 3vw, 32px);
    border: 1px solid var(--portfolio-border);
    border-radius: 18px;
    background: var(--portfolio-surface);

    @media (min-width: 768px) {
        grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
        align-items: center;
    }
}

.featured-case__media {
    overflow: hidden;
    border-radius: 12px;

    img {
        display: block;
        width: 100%;
        height: auto;
    }
}

.featured-case__content {
    display: grid;
    gap: 16px;

    h3,
    p {
        margin: 0;
    }

    h3 {
        color: var(--portfolio-title);
        font-size: clamp(30px, 4vw, 52px);
    }
}

.featured-case__type {
    color: var(--portfolio-accent);
}

.featured-case__contributions {
    display: grid;
    gap: 8px;
    margin: 0;
    padding-left: 20px;
    color: var(--portfolio-muted);
}

.featured-case__links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>
