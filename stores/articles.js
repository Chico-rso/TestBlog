export const useArticles = defineStore("articles", {
	state: () => ({
		articles: [],
		homePage: [],
	}),
	getters: {
		getArticles(state)
		{
			// проитись по массиву и достать статьи из него
			return state.articles.map((item) =>
			{
				item.data.articles
			})
		}
	},
	actions: {
		async fetchHomePage()
		{
			const response = await fetch("https://devtwit8.ru/api/v1/page/?path=/");
			this.homePage = await response.json();
			console.log(this.homePage.body);
			
			
		},
		async fetchArticles(){
			const response = await fetch(`https://devtwit8.ru/api/v1/page/?path=/${this.$route.params.slug}`);
			this.articles = await response.json();
		}
	},
});

