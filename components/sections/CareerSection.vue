<template>
    <section class="section section--experience" aria-labelledby="career-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="career-title">{{ section.title }}</h2>
                <p>{{ section.subtitle }}</p>
            </div>
            <ol class="career-list">
                <li v-for="item in items" :key="`${item.company}-${item.period}`" class="career-entry reveal"
                    data-career-entry>
                    <div class="career-entry__head">
                        <h3>{{ item.company }}</h3>
                        <p>{{ item.period }}</p>
                    </div>
                    <p class="career-entry__role">{{ item.role }}</p>
                    <p class="career-entry__stack">{{ item.stack }}</p>
                    <ul>
                        <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
                    </ul>
                </li>
            </ol>
        </div>
    </section>
</template>

<script setup>
defineProps({
    items: {type: Array, required: true},
    section: {type: Object, required: true},
});
</script>

<style scoped lang="scss">
.career-list {
    display: grid;
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.career-entry {
    padding: clamp(18px, 2.5vw, 28px);
    border: 1px solid var(--portfolio-border);
    border-radius: 14px;
    background: var(--portfolio-surface);
}

.career-entry__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px 20px;

    h3,
    p {
        margin: 0;
    }

    h3 {
        color: var(--portfolio-title);
        font-size: clamp(24px, 3vw, 34px);
    }

    p {
        color: var(--portfolio-muted);
    }
}

.career-entry__role {
    margin: 8px 0 0;
    color: var(--portfolio-accent);
    font-weight: 700;
}

.career-entry__stack {
    margin: 8px 0 0;
    color: var(--portfolio-muted);
}

.career-entry ul {
    display: grid;
    gap: 8px;
    margin: 16px 0 0;
    padding-left: 20px;
    line-height: 1.5;
}
</style>
