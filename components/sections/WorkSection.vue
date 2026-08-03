<template>
    <section class="section section--work" aria-labelledby="work-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="work-title">{{ system.title }}</h2>
                <p>{{ system.subtitle }}</p>
            </div>
            <ul class="work-grid" role="list">
                <li v-for="(project, index) in copy.projects" :key="project.id">
                    <article class="work-card reveal" data-project-card>
                        <span class="work-card__glow" aria-hidden="true"></span>
                        <header class="work-card__top">
                            <span class="work-card__index">
                                {{ system.projectPrefix }}_{{ String(index + 1).padStart(2, '0') }}
                            </span>
                            <div>
                                <h3>{{ project.name }}</h3>
                                <p>{{ project.type }}</p>
                            </div>
                        </header>
                        <p class="work-card__summary">{{ project.description }}</p>
                        <div class="work-card__contribution">
                            <span>{{ system.contributionLabel }}</span>
                            <ul role="list">
                                <li v-for="item in project.contributions" :key="item">{{ item }}</li>
                            </ul>
                        </div>
                        <ul class="work-card__tags" role="list">
                            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
                        </ul>
                        <div class="work-card__links">
                            <template v-if="project.links.length">
                                <a v-for="link in project.links" :key="link.url" :href="link.url" target="_blank"
                                   rel="noreferrer">
                                    {{ link.label }} <span aria-hidden="true">↗</span>
                                </a>
                            </template>
                            <span v-else class="work-card__nda">{{ copy.labels.nda }}</span>
                        </div>
                        <span class="work-card__signal" aria-hidden="true"></span>
                    </article>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
defineProps({
    copy: {type: Object, required: true},
    system: {type: Object, required: true},
});
</script>
