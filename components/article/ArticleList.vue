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

onMounted(()=>
{
})
</script>
<style lang="scss">
.article__list
{
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 30px;
}
.article__item
{
	flex-basis: 100%;
	a
	{
		display: flex;
		flex-direction: column;
	}
	@media (min-width: $tablet)
	{
		flex-basis: calc(50% - 30px);
	}
	@media (min-width: $desktop)
	{
		flex-basis: 31%;
	}
}
</style>
