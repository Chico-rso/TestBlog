<template>
    <section class="section section--about" aria-labelledby="about-title">
        <div class="container">
            <div class="about-card reveal">
                <div>
                    <h2 id="about-title">{{ copy.sections.about.title }}</h2>
                    <p>{{ copy.sections.about.subtitle }}</p>
                </div>
                <address class="about-card__details">
                    <div>
                        <span>Email</span>
                        <a :href="`mailto:${email}`">{{ email }}</a>
                    </div>
                    <div>
                        <span>Telegram</span>
                        <a :href="`https://t.me/${telegram}`" target="_blank" rel="noreferrer">@{{ telegram }}</a>
                    </div>
                    <div>
                        <span>{{ copy.footer.locationLabel }}</span>
                        <strong>{{ copy.hero.location }}</strong>
                    </div>
                </address>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    copy: {type: Object, required: true},
    email: {type: String, required: true},
    telegram: {type: String, required: true},
});
</script>
