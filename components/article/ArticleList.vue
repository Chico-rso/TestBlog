<template>
	<ul class="article__list">
		<li class="article__item">
			<NuxtLink to="#">
				<Article />
			</NuxtLink>
		</li>
	</ul>
</template>

<script setup>
import {useArticles} from "~/stores/articles";

const { articles } = useArticles().fetchArticles();

onMounted(()=>{
	console.log(articles)
})

</script>
