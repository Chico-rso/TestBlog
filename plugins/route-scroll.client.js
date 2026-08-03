export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter();
    let pendingHash = '';

    router.afterEach((to, from) => {
        pendingHash = to.path === from.path ? '' : to.hash;
    });

    nuxtApp.hook('page:finish', () => {
        const hash = pendingHash;
        pendingHash = '';
        if (!hash) {
            return;
        }

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                const targetId = hash.slice(1);
                document.getElementById(targetId)?.scrollIntoView({behavior: 'instant', block: 'start'});
            });
        });
    });
});
