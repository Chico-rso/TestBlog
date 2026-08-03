<template>
	<div ref="root" class="case-page" data-case-page="u2">
		<CaseHero :project="project" :case-data="caseData" :external-url="externalUrl"/>
		<CaseFacts :facts="caseData.facts"/>
		<CaseNarrative :items="caseData.narrative"/>
		<CaseGallery :items="caseData.gallery" :fallback-text="project.name"/>
		<CaseResult :heading="resultHeading" :result="caseData.result" :technologies="caseData.technologies"/>
		<CaseNavigation
			:case-data="caseData"
			:project="project"
			:home-path="homePath"
			:public-url="externalUrl"
			:next-project-url="nextProjectUrl"
		/>
	</div>
</template>

<script setup>
import {portfolioRoutes} from '~/lib/portfolio/routes.js';

const root = ref(null);
const {t, lang} = useLanguage();
const project = computed(() => t.value.projects.find(({id}) => id === 'u2'));
const caseData = computed(() => project.value?.case);
const externalUrl = computed(() => project.value?.links?.[0]?.url);

if (!project.value || !caseData.value || !externalUrl.value) {
	throw createError({statusCode: 404, statusMessage: 'U2 case not found'});
}

const homePath = computed(() => portfolioRoutes[lang.value].home);
const nextProjectUrl = 'https://novaya.ru/';
const resultHeading = computed(() => (
	caseData.value.narrative.find(({id}) => id === 'result')?.title || caseData.value.eyebrow
));

usePortfolioHead('u2');
usePortfolioAnimations(root);
</script>

<style scoped lang="scss">
.case-page {
	display: grid;
	gap: clamp(36px, 7vw, 88px);
	padding-block: clamp(36px, 7vw, 88px);
}
</style>
