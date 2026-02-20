<template>
    <section class="section section--work" aria-labelledby="work-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="work-title">{{ system.title }}</h2>
                <p>{{ system.subtitle }}</p>
            </div>
            <ul class="work-grid" role="list">
                <li v-for="(project, index) in copy.projects" :key="project.name">
                    <article class="work-card reveal">
                        <div class="work-card__top">
                            <h3>{{ system.projectPrefix }}_{{ String(index + 1).padStart(2, '0') }} · {{ project.name }}</h3>
                            <span>{{ project.type }}</span>
                        </div>
                        <ul class="work-card__meta" role="list">
                            <li>{{ system.statusLabel }}: <b>{{ system.status }}</b></li>
                            <li>{{ system.roleLabel }}: <b>{{ system.role }}</b></li>
                            <li>{{ system.stackLabel }}: <b>{{ project.tags.join(' / ') }}</b></li>
                            <li>{{ system.resultLabel }}: <b>{{ system.result }}</b></li>
                        </ul>
                        <ul class="work-card__details" role="list">
                            <li>{{ system.problem }}: {{ project.description }}</li>
                            <li>{{ system.solution }}: {{ project.tags.join(', ') }}</li>
                            <li>{{ system.impact }}: {{ system.impactValue }}</li>
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
    system: {type: Object, required: true},
});
</script>
