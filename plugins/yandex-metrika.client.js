const COUNTER_ID = 106719755;
const SCRIPT_URL = `https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}`;
const INITIALIZED_MARKER = '__portfolioYandexMetrikaInitialized';
const LAST_TRACKED_URL_MARKER = '__portfolioYandexMetrikaLastTrackedUrl';
const QUEUE_MARKER = '__portfolioYandexMetrikaQueue';
const RETRY_DELAY = 3000;
const SCRIPT_LOAD_TIMEOUT = 10000;
const MAX_RETRIES = 1;

export default defineNuxtPlugin((nuxtApp) => {
    let activeScript;
    let disposed = false;
    let idleHandle;
    let retryCount = 0;
    let retryHandle;
    let scriptLoadTimeoutHandle;
    let timeoutHandle;
    let waitingForLoad = false;
    let removePageFinishHook = () => {};

    const trackCurrentPage = () => {
        if (disposed || !window[INITIALIZED_MARKER] || typeof window.ym !== 'function') {
            return;
        }

        const currentUrl = window.location.href;
        const lastTrackedUrl = window[LAST_TRACKED_URL_MARKER];
        if (currentUrl === lastTrackedUrl) {
            return;
        }

        const hitOptions = {title: document.title};
        const referer = lastTrackedUrl || document.referrer;
        if (referer && referer !== currentUrl) {
            hitOptions.referer = referer;
        }

        try {
            window.ym(COUNTER_ID, 'hit', currentUrl, hitOptions);
            window[LAST_TRACKED_URL_MARKER] = currentUrl;
        } catch {
        }
    };

    const scheduleRetry = () => {
        if (disposed || retryHandle !== undefined || retryCount >= MAX_RETRIES) {
            return;
        }

        retryCount += 1;
        retryHandle = window.setTimeout(() => {
            retryHandle = undefined;
            loadScript();
        }, RETRY_DELAY);
    };

    const initialize = () => {
        if (disposed || typeof window.ym !== 'function') {
            return;
        }
        if (window[INITIALIZED_MARKER]) {
            trackCurrentPage();
            return;
        }

        try {
            window.ym(COUNTER_ID, 'init', {
                ssr: true,
                webvisor: true,
                clickmap: true,
                accurateTrackBounce: true,
                trackLinks: true,
                defer: true,
            });
            window[INITIALIZED_MARKER] = true;
            trackCurrentPage();
        } catch {
            window[INITIALIZED_MARKER] = false;
            scheduleRetry();
        }
    };

    const ensureQueue = () => {
        if (typeof window.ym === 'function') {
            return;
        }

        const queue = function (...args) {
            (queue.a = queue.a || []).push(args);
        };
        queue.l = Date.now();
        queue[QUEUE_MARKER] = true;
        window.ym = queue;
    };

    const detachScriptListeners = () => {
        activeScript?.removeEventListener('load', onScriptLoad);
        activeScript?.removeEventListener('error', onScriptError);
    };

    const clearScriptLoadTimeout = () => {
        if (scriptLoadTimeoutHandle === undefined) {
            return;
        }

        window.clearTimeout(scriptLoadTimeoutHandle);
        scriptLoadTimeoutHandle = undefined;
    };

    const failActiveScript = () => {
        const failedScript = activeScript;
        clearScriptLoadTimeout();
        detachScriptListeners();
        activeScript = undefined;
        failedScript?.remove();

        if (window.ym?.[QUEUE_MARKER]) {
            delete window.ym;
        }
        window[INITIALIZED_MARKER] = false;
        scheduleRetry();
    };

    const onScriptLoad = () => {
        if (!activeScript) {
            return;
        }

        activeScript.dataset.loaded = 'true';
        clearScriptLoadTimeout();
        detachScriptListeners();
        initialize();
    };

    const onScriptError = () => {
        failActiveScript();
    };

    const watchScript = (script) => {
        clearScriptLoadTimeout();
        activeScript = script;
        activeScript.addEventListener('load', onScriptLoad, {once: true});
        activeScript.addEventListener('error', onScriptError, {once: true});
        scriptLoadTimeoutHandle = window.setTimeout(failActiveScript, SCRIPT_LOAD_TIMEOUT);
    };

    function loadScript() {
        if (disposed) {
            return;
        }
        if (window[INITIALIZED_MARKER]) {
            trackCurrentPage();
            return;
        }

        const existingScript = document.querySelector('script[data-portfolio-yandex-metrika]')
            || Array.from(document.scripts).find(({src}) => src === SCRIPT_URL);
        if (existingScript) {
            if (existingScript.dataset.loaded === 'true' || (
                typeof window.ym === 'function' && !window.ym[QUEUE_MARKER]
            )) {
                activeScript = existingScript;
                initialize();
            } else {
                ensureQueue();
                watchScript(existingScript);
            }
            return;
        }

        ensureQueue();
        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.async = true;
        script.dataset.portfolioYandexMetrika = 'true';
        watchScript(script);
        document.head.append(script);
    }

    const schedule = () => {
        if ('requestIdleCallback' in window) {
            idleHandle = window.requestIdleCallback(loadScript);
        } else {
            timeoutHandle = window.setTimeout(loadScript, RETRY_DELAY);
        }
    };

    const onLoad = () => {
        waitingForLoad = false;
        schedule();
    };

    const registerPageFinishHook = () => {
        removePageFinishHook = nuxtApp.hook('page:finish', trackCurrentPage);
    };

    registerPageFinishHook();

    if (document.readyState === 'complete') {
        schedule();
    } else {
        waitingForLoad = true;
        window.addEventListener('load', onLoad, {once: true});
    }

    const disposeRuntime = () => {
        disposed = true;
        removePageFinishHook();
        removePageFinishHook = () => {};
        if (waitingForLoad) {
            window.removeEventListener('load', onLoad);
            waitingForLoad = false;
        }
        if (idleHandle !== undefined && 'cancelIdleCallback' in window) {
            window.cancelIdleCallback(idleHandle);
            idleHandle = undefined;
        }
        if (timeoutHandle !== undefined) {
            window.clearTimeout(timeoutHandle);
            timeoutHandle = undefined;
        }
        if (retryHandle !== undefined) {
            window.clearTimeout(retryHandle);
            retryHandle = undefined;
        }
        clearScriptLoadTimeout();
        detachScriptListeners();
    };

    const onPageHide = () => {
        disposeRuntime();
    };

    const onPageShow = (event) => {
        if (!event.persisted) {
            return;
        }

        disposed = false;
        registerPageFinishHook();
        window.addEventListener('pagehide', onPageHide, {once: true});
        if (window[INITIALIZED_MARKER]) {
            trackCurrentPage();
        } else {
            schedule();
        }
    };

    const cleanup = () => {
        window.removeEventListener('pagehide', onPageHide);
        window.removeEventListener('pageshow', onPageShow);
        disposeRuntime();
    };

    window.addEventListener('pagehide', onPageHide, {once: true});
    window.addEventListener('pageshow', onPageShow);
    import.meta.hot?.dispose(cleanup);
});
