<template>
	<div class="case-gallery container">
		<figure
			v-for="(item, index) in items"
			:key="getMediaKey(item, index)"
			class="case-media reveal"
			data-case-media
		>
			<div
				class="case-media__visual"
				:class="{'case-media__visual--failed': hasFailed(item, index)}"
				:style="mediaStyle(item)"
			>
				<picture v-if="item?.webp" class="case-media__picture">
					<source v-if="item?.avif" :srcset="item.avif" type="image/avif">
					<img
						:src="item?.webp"
						:width="item?.width"
						:height="item?.height"
						:alt="item.alt"
						:loading="index === 0 ? 'eager' : 'lazy'"
						decoding="async"
						@error="markFailed(item, index)"
					>
				</picture>
				<div v-show="hasFailed(item, index) || !item?.webp" class="case-media__fallback" aria-hidden="true">
					{{ item?.alt || fallbackText }}
				</div>
			</div>
			<figcaption :aria-hidden="hasFailed(item, index) ? undefined : 'true'">{{ item?.alt || fallbackText }}</figcaption>
		</figure>
	</div>
</template>

<script setup>
const props = defineProps({
	items: {type: Array, required: true},
	fallbackText: {type: String, required: true},
});

const failedItems = reactive(new Set());
const getMediaKey = (item, index) => item?.webp || item?.avif || `${props.fallbackText}-${index}`;
const hasFailed = (item, index) => failedItems.has(getMediaKey(item, index));
const markFailed = (item, index) => failedItems.add(getMediaKey(item, index));
const mediaStyle = (item) => ({
	'--case-media-ratio': `${item?.width || 1} / ${item?.height || 1}`,
});
</script>

<style scoped lang="scss">
.case-gallery {
	display: grid;
	gap: 28px;
}

.case-media {
	min-width: 0;
	margin: 0;
}

.case-media__visual {
	position: relative;
	overflow: hidden;
	aspect-ratio: var(--case-media-ratio);
}

.case-media__picture,
.case-media__picture img {
	display: block;
	width: 100%;
	height: 100%;
}

.case-media__picture img {
	object-fit: contain;
}

.case-media__visual--failed .case-media__picture {
	visibility: hidden;
}

.case-media__fallback {
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	padding: 20px;
	text-align: center;
}

.case-media figcaption {
	margin-top: 8px;
}
</style>
