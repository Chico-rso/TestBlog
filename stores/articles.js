export const useArticles = defineStore('articles', {
    state: () => ({
        articles: [],
        homePage: [],
    }),
    actions: {
        async fetchHomePage() {
            const response = await fetch('https://devtwit8.ru/api/v1/page/?path=/');
            this.homePage = await response.json();
            const {body} = this.homePage;
            const {data} = body[0];
            const {articles} = data;
            
            this.homePage = articles;
        },
        async fetchArticles() {
            const response = await fetch(`https://devtwit8.ru/api/v1/page/?path=/${ this.$route.params.slug }`);
            this.articles = await response.json();
        },
    },
    getters: {
        getArticles(state) {return state.homePage;},
    },
});

