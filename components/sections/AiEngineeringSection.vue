<template>
    <section class="section section--ai-engineering" aria-labelledby="ai-engineering-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="ai-engineering-title">{{ copy.title }}</h2>
                <p>{{ copy.subtitle }}</p>
            </div>
            <p class="ai-engineering__lead reveal">{{ copy.lead }}</p>
            <ol class="ai-engineering__grid" role="list">
                <li v-for="(step, index) in copy.steps" :key="step.title" class="ai-engineering__card reveal">
                    <span class="ai-engineering__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
                    <h3>{{ step.title }}</h3>
                    <p>{{ step.description }}</p>
                </li>
            </ol>
            <div class="ai-engineering__quality reveal">
                <strong>{{ copy.qualityTitle }}</strong>
                <p>{{ copy.qualityText }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    copy: {type: Object, required: true},
});
</script>

<style scoped lang="scss">
.ai-engineering__lead {
    max-width: 760px;
    margin: 0 0 28px;
    color: var(--portfolio-muted);
    line-height: 1.7;
}
.ai-engineering__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    padding: 0;
    margin: 0;
    list-style: none;
}
.ai-engineering__card {
    padding: clamp(20px, 2.5vw, 30px);
    border: 1px solid var(--portfolio-border);
    border-radius: 16px;
    background: var(--portfolio-surface);
}
.ai-engineering__number {
    display: inline-block;
    margin-bottom: 18px;
    color: var(--portfolio-accent-ink);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
}
.ai-engineering__card h3 {
    margin: 0 0 12px;
    color: var(--portfolio-title);
    font-size: clamp(18px, 2vw, 22px);
}
.ai-engineering__card p,
.ai-engineering__quality p {
    margin: 0;
    color: var(--portfolio-muted);
    line-height: 1.65;
}
.ai-engineering__quality {
    display: grid;
    gap: 10px;
    margin-top: 16px;
    padding: 22px 28px;
    border-left: 3px solid var(--portfolio-accent);
    border-radius: 12px;
    background: var(--portfolio-surface);
}
.ai-engineering__quality strong { color: var(--portfolio-title); }
@media (max-width: 760px) {
    .ai-engineering__grid { grid-template-columns: 1fr; }
    .ai-engineering__quality { padding: 20px; }
}
</style>
