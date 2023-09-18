<template>
	<section class="index">
		<ArticleList
			:articles="store.getArticles"
		/>
	</section>
</template>

<script setup>
import { useArticles } from "~/stores/articles";

const store = useArticles();

onMounted(async () =>
{
	await store.fetchHomePage()
});
</script>

<style lang="scss" scoped>
p
{
	font-size: 18px;
	font-style: italic;
	font-weight: 300;
	line-height: 26px;
}
.index
{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 30px 0 200px 0;
}
</style>
