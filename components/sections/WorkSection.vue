<template>
    <section class="section section--work" aria-labelledby="work-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="work-title">{{ copy.sections.projects.title }}</h2>
                <p>{{ copy.sections.projects.subtitle }}</p>
            </div>
            <ul class="work-grid" role="list">
                <li v-for="project in projects" :key="project.id">
                    <article class="work-card reveal" data-project-card>
                        <span class="work-card__glow" aria-hidden="true"></span>
                        <header class="work-card__top">
                            <div>
                                <h3>{{ project.name }}</h3>
                                <p>{{ project.type }}</p>
                            </div>
                        </header>
                        <p class="work-card__summary">{{ project.description }}</p>
                        <div class="work-card__contribution">
                            <ul role="list">
                                <li v-for="item in project.contributions" :key="item">{{ item }}</li>
                            </ul>
                        </div>
                        <ul class="work-card__tags" role="list">
                            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
                        </ul>
                        <div class="work-card__links">
                            <a v-if="project.links[0]" :href="project.links[0].url" target="_blank" rel="noreferrer">
                                {{ project.links[0].label }} <span aria-hidden="true">↗</span>
                            </a>
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
const props = defineProps({
    copy: {type: Object, required: true},
});

const projects = computed(() => props.copy.projects.filter(project => !project.featured));
</script>
