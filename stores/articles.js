export const useArticles = defineStore("articles", {
	state: () => ({
		articles: [],
	}),
	getters: {},
	actions: {
		async fetchArticles()
		{
			const response = await fetch("https://jsonplaceholder.typicode.com/posts");
			this.articles = await response.json();
		},
	},
});
