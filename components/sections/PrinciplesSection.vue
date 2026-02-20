<template>
    <section class="section section--principles" aria-labelledby="principles-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="principles-title">{{ system.title }}</h2>
            </div>
            <ul class="principles-grid" role="list">
                <li v-for="item in system.items" :key="item" class="principle-card reveal">
                    <span class="principle-card__mark">::</span>
                    <p>{{ item }}</p>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
defineProps({
    system: {type: Object, required: true},
});
</script>
