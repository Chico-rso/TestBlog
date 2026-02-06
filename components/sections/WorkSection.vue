<template>
    <section class="section section--work" aria-labelledby="work-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="work-title">{{ copy.sections.work.title }}</h2>
                <p>{{ copy.sections.work.subtitle }}</p>
            </div>
            <ul class="work-grid" role="list">
                <li v-for="project in copy.projects" :key="project.name">
                    <article class="work-card reveal">
                        <div class="work-card__top">
                            <h3>{{ project.name }}</h3>
                            <span>{{ project.type }}</span>
                        </div>
                        <p class="work-card__desc">{{ project.description }}</p>
                        <ul class="work-card__tags" role="list">
                            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
                        </ul>
                        <div class="work-card__links">
                            <template v-if="project.links.length">
                                <a v-for="link in project.links" :key="link.url" :href="link.url" target="_blank"
                                   rel="noreferrer">
                                    {{ link.label }}
                                </a>
                            </template>
                            <span v-else class="work-card__nda">{{ copy.labels.nda }}</span>
                        </div>
                    </article>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
defineProps({
    copy: {type: Object, required: true},
});
</script>
