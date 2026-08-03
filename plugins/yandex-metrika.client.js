const COUNTER_ID = 106719755;
const SCRIPT_URL = `https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}`;
const INITIALIZED_MARKER = '__portfolioYandexMetrikaInitialized';

export default defineNuxtPlugin(() => {
    let idleHandle;
    let timeoutHandle;
    let waitingForLoad = false;

    const initialize = () => {
        if (window[INITIALIZED_MARKER] || typeof window.ym !== 'function') {
            return;
        }

        window[INITIALIZED_MARKER] = true;
        window.ym(COUNTER_ID, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            accurateTrackBounce: true,
            trackLinks: true,
        });
    };

    const ensureQueue = () => {
        if (typeof window.ym === 'function') {
            return;
        }

        window.ym = function (...args) {
            (window.ym.a = window.ym.a || []).push(args);
        };
        window.ym.l = Date.now();
    };

    const loadScript = () => {
        try {
            if (window[INITIALIZED_MARKER]) {
                return;
            }

            ensureQueue();
            const existingScript = document.querySelector('script[data-portfolio-yandex-metrika]');
            if (existingScript) {
                if (existingScript.dataset.loaded === 'true') {
                    initialize();
                } else {
                    existingScript.addEventListener('load', initialize, {once: true});
                }
                return;
            }

            const script = document.createElement('script');
            script.src = SCRIPT_URL;
            script.async = true;
            script.dataset.portfolioYandexMetrika = 'true';
            script.addEventListener('load', () => {
                script.dataset.loaded = 'true';
                initialize();
            }, {once: true});
            script.addEventListener('error', () => {}, {once: true});
            document.head.append(script);
        } catch {
        }
    };

    const schedule = () => {
        if ('requestIdleCallback' in window) {
            idleHandle = window.requestIdleCallback(loadScript);
        } else {
            timeoutHandle = window.setTimeout(loadScript, 3000);
        }
    };

    const onLoad = () => {
        waitingForLoad = false;
        schedule();
    };

    if (document.readyState === 'complete') {
        schedule();
    } else {
        waitingForLoad = true;
        window.addEventListener('load', onLoad, {once: true});
    }

    const cleanup = () => {
        window.removeEventListener('pagehide', cleanup);
        if (waitingForLoad) {
            window.removeEventListener('load', onLoad);
        }
        if (idleHandle !== undefined && 'cancelIdleCallback' in window) {
            window.cancelIdleCallback(idleHandle);
        }
        if (timeoutHandle !== undefined) {
            window.clearTimeout(timeoutHandle);
        }
    };

    window.addEventListener('pagehide', cleanup, {once: true});
    import.meta.hot?.dispose(cleanup);
});
