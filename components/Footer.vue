<template>
	<div class="footer__line"></div>
	<footer class="footer container">
		<div class="footer__top">
			<div class="footer__logo">
				<svg width="133" height="32">
					<use xlink:href="#mainLogo"></use>
				</svg>
				<p class="footer__text">Cтатьи о дизайне и искусстве, которые исследуют творческие вдохновения и актуальные тенденции, раскрывая мир эстетики и креативности</p>
			</div>
			<div class="footer__links">
				<div class="footer__links-email">
					<span>email</span>
					<a href="mailto:testblogsupport@gmail.com">testblogsupport@gmail.com</a>
				</div>

				<ul class="footer__social-list">
					<li class="footer__social-item">
						<NuxtLink to="#">
							<svg width="30" height="30">
								<use xlink:href="#facebook"></use>
							</svg>
						</NuxtLink>
					</li>
					<li class="footer__social-item">
						<NuxtLink to="#">
							<svg width="30" height="30">
								<use xlink:href="#vk"></use>
							</svg>
						</NuxtLink>
					</li>
					<li class="footer__social-item">
						<NuxtLink to="#">
							<svg width="30" height="30">
								<use xlink:href="#instagram"></use>
							</svg>
						</NuxtLink>
					</li>
					<li class="footer__social-item">
						<NuxtLink to="#">
							<svg width="30" height="30">
								<use xlink:href="#telegram"></use>
							</svg>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</div>
		<div class="footer__bottom">
			<Subscribe />
		</div>
	</footer>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.footer__line
{
	position: relative;
	width: 100%;
	height: 2px;
	background: var(--gray, #8D959C);
}
.footer
{
	display: flex;
	justify-content: center;
	flex-direction: column;
	@media (min-width: $tablet){display: block;}
}
.footer__top
{
	margin-bottom: 30px;
	@media (min-width: $tablet)
	{
		display: flex;
		padding: 50px 0 0 0;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 70px;
	}
}
.footer__logo
{
	margin-bottom: 14px;
	svg
	{
		margin-bottom: 10px;
		@media (min-width: $tablet){margin-bottom: 20px;}
	}
	@media (min-width: $tablet){margin-bottom: 0;}
}
.footer__text
{
	max-width: 426px;
	text-align: left;
	color: var(--gray, #8D959C);
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 20px;
}
.footer__social-list
{
	display: flex;
	gap: 20px;
	align-items: center;
	a{display: flex;}
}
.footer__links-email
{
	margin-bottom: 14px;
	span
	{
		display: block;
		color: var(--gray, #8D959C);
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 20px;
	}
	a
	{
		color: var(--text, #1B1B1B);
		font-size: 18px;
		font-style: normal;
		font-weight: 600;
		line-height: 22px;
	}
	@media(min-width: $tablet){margin-bottom: 24px;}
}
.footer__bottom
{
	border-radius: 2px;
	background: var(--text, #1B1B1B);
	span{color: #fefefe}
}
</style>
