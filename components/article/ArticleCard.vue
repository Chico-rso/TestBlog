<template>
	<NuxtLink :to="link" class="article">
		<div class="article__img">
			<img loading="lazy" alt="" :src="img">
		</div>
		<p>{{text}}</p>
		<Button custom-class="black" custom-width="164px" text-value="Читать"></Button>
	</NuxtLink>
</template>

<script setup>

const props = defineProps({
	img:
		{
			type: String,
			default: "",
		},
	text:
		{
			type: String,
			default: "",
		},
	link:
		{
			type: String,
			default: "",
		},

});
</script>
<style lang="scss">
.article
{
	cursor: pointer;
	p
	{
		margin-bottom: 30px;
		overflow: hidden;
		color: #1B1B1B;
		text-overflow: ellipsis;
		font-size: 22px;
		font-style: normal;
		font-weight: 800;
		line-height: 30px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}
.article__img
{
	max-width: 427px;
	height: 320px;
	width: 100%;
	margin-bottom: 20px;
	img
	{
		height: 100%;
		width: 100%;
		object-fit: cover;
	}
}
</style>
