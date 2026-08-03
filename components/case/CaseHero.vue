<template>
	<section class="case-hero container reveal" aria-labelledby="case-title">
		<article class="case-hero__content">
			<p class="case-hero__eyebrow">{{ caseData.eyebrow }}</p>
			<h1 id="case-title">{{ project.name }}</h1>
			<p class="case-hero__summary">{{ caseData.summary }}</p>
			<a :href="externalUrl" target="_blank" rel="noreferrer">
				{{ caseData.externalLabel }}
			</a>
		</article>
		<picture class="case-hero__media">
			<source :srcset="project.teaserMedia.avif" type="image/avif">
			<img
				:src="project.teaserMedia.webp"
				:width="project.teaserMedia.width"
				:height="project.teaserMedia.height"
				:alt="project.teaserMedia.alt"
				fetchpriority="high"
				decoding="async"
			>
		</picture>
	</section>
</template>

<script setup>
defineProps({
	project: {type: Object, required: true},
	caseData: {type: Object, required: true},
	externalUrl: {type: String, required: true},
});
</script>

<style scoped lang="scss">
.case-hero {
	display: grid;
	gap: 24px;
}

.case-hero__content {
	display: grid;
	align-content: center;
	gap: 16px;

	p,
	h1 {
		margin: 0;
	}
}

.case-hero__media {
	display: block;
	overflow: hidden;

	img {
		display: block;
		width: 100%;
		height: auto;
	}
}

@media (min-width: 768px) {
	.case-hero {
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		align-items: center;
	}
}
</style>
