<template>
    <ul class="article__list">
        <li class="article__item" v-for="article in articles">
            <ArticleCard
                :img="article.image"
                :text="article.title"
                :link="article.link"
            />
        </li>
    </ul>
</template>

<script setup>
const props = defineProps({
    articles:
        {
            type: Array,
            default: [],
        },
});

onMounted(() => {
    console.log(props.articles, 'props.articles');

});
</script>
<style lang="scss">
.article__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 30px;
}

.article__item {
    flex-basis: 100%;
    transition: all .3s ease;
    padding: 10px;
    border-radius: 6px;

    a {
        display: flex;
        flex-direction: column;
    }

    &:hover {
        box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
    }

    @media (min-width: $tablet) {
        flex-basis: calc(50% - 30px);
    }
    @media (min-width: $desktop) {
        flex-basis: 31%;
    }
}
</style>
