export const useArticles = defineStore("articles", {
	state: () => ({
		articles: [],
		homePage: [],
	}),
	actions: {
		async fetchHomePage()
		{
			const response = await fetch("https://devtwit8.ru/api/v1/page/?path=/");
			this.homePage = await response.json();
			console.log(this.homePage,'this.homePage');
		},
		async fetchArticles(){
			const response = await fetch(`https://devtwit8.ru/api/v1/page/?path=/${this.$route.params.slug}`);
			this.articles = await response.json();
			console.log(this.articles,'this.articles');
		}
	},
	getters: {
		getArticles(state)
		{
			return state.homePage
		}
	},
});

