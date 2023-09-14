<template>
	<section class="index">
		<ArticleList
			:articles="articles"
		/>
	</section>
</template>

<script setup>
import {useArticles} from "~/stores/articles";

const storeHome = useArticles();

const articles = reactive([
	{
		"title": "Мир динамичного 3D Цифрового Искусства",
		"link": "/article-1",
		"image": "https://devtwit8.ru/img/p1.png",
	},
	{
		"title": "Есть над чем задуматься: небо темнеет",
		"link": "/article-2",
		"image": "https://devtwit8.ru/img/p2.png",
	},
	{
		"title": "Мелочь, а приятно: чистосердечное признание облегчает душу",
		"link": "/article-3",
		"image": "https://devtwit8.ru/img/p3.png",
	},
	{
		"title": "Очевидцы сообщают, что слышали старческий скрип Амстердама",
		"link": "/article-4",
		"image": "https://devtwit8.ru/img/p4.png",
	},
	{
		"title": "Британские «ученые» заявили, что обереги никого не защитили",
		"link": "/article-5",
		"image": "https://devtwit8.ru/img/p5.png",
	},
	{
		"title": "Есть над чем задуматься: частокол на границе починят",
		"link": "/article-6",
		"image": "https://devtwit8.ru/img/p6.png",
	},
	{
		"title": "Мир динамичного 3D Цифрового Искусства",
		"link": "/article-1",
		"image": "https://devtwit8.ru/img/p1.png",
	},
	{
		"title": "Есть над чем задуматься: небо темнеет",
		"link": "/article-2",
		"image": "https://devtwit8.ru/img/p2.png",
	},
	{
		"title": "Мелочь, а приятно: чистосердечное признание облегчает душу",
		"link": "/article-3",
		"image": "https://devtwit8.ru/img/p3.png",
	},
	{
		"title": "Очевидцы сообщают, что слышали старческий скрип Амстердама",
		"link": "/article-4",
		"image": "https://devtwit8.ru/img/p4.png",
	},
	{
		"title": "Британские «ученые» заявили, что обереги никого не защитили",
		"link": "/article-5",
		"image": "https://devtwit8.ru/img/p5.png",
	},
	{
		"title": "Есть над чем задуматься: частокол на границе починят",
		"link": "/article-6",
		"image": "https://devtwit8.ru/img/p6.png",
	},
]);

onMounted(() =>
{

	storeHome.fetchHomePage();
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
