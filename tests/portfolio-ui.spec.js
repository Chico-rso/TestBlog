import {mkdirSync} from 'node:fs';

import {expect, test} from 'playwright/test';

const screenshotsDirectory = 'output/playwright';
const screenshotProjects = new Set(['desktop-chromium', 'mobile-390']);
const yandexEndpoint = /^https:\/\/mc\.yandex\.(?:ru|com)\//;
const u2Asset = /\/projects\/u2\/[^/?]+\.(?:avif|webp)(?:\?.*)?$/;

const isExplicitThirdPartyNoise = (text) => (
    /mc\.yandex\.(?:ru|com)/.test(text)
    && /ERR_BLOCKED_BY_CLIENT|Failed to load resource/.test(text)
);

const preparePage = async (page, {allowExpectedImage404 = false} = {}) => {
    const applicationErrors = [];

    await page.route(yandexEndpoint, async (route) => {
        const isScript = route.request().resourceType() === 'script';
        await route.fulfill({
            status: 200,
            contentType: isScript ? 'application/javascript' : 'text/plain',
            body: '',
        });
    });

    page.on('console', (message) => {
        if (message.type() !== 'error') {
            return;
        }

        const text = message.text();
        const isExpectedImage404 = allowExpectedImage404
            && text === 'Failed to load resource: the server responded with a status of 404 (Not Found)';
        if (!isExplicitThirdPartyNoise(text) && !isExpectedImage404) {
            applicationErrors.push(`console: ${text}`);
        }
    });
    page.on('pageerror', (error) => applicationErrors.push(`pageerror: ${error.message}`));

    return applicationErrors;
};

const waitForStableLayout = async (page) => {
    await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((image) => {
            if (image.complete) {
                return undefined;
            }

            return new Promise((resolve) => {
                image.addEventListener('load', resolve, {once: true});
                image.addEventListener('error', resolve, {once: true});
            });
        }));
    });
};

const gotoHydrated = async (page, path) => {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-theme', /^(?:light|dark)$/);
};

const expectNoHorizontalOverflow = async (page) => {
    const dimensions = await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth);
};

const expectNoApplicationErrors = (applicationErrors) => {
    expect(applicationErrors).toEqual([]);
};

const revealFullPage = async (page) => {
    const reveals = page.locator('.reveal');
    for (let index = 0; index < await reveals.count(); index += 1) {
        await reveals.nth(index).evaluate((element) => {
            element.scrollIntoView({behavior: 'instant', block: 'center'});
        });
    }

    await expect.poll(() => reveals.evaluateAll((elements) => elements
        .filter((element) => getComputedStyle(element).opacity !== '1')
        .map((element) => ({
            className: element.className,
            text: element.textContent.trim().slice(0, 80),
            top: element.getBoundingClientRect().top,
        })))).toEqual([]);
    await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
};

const saveScreenshot = async (page, testInfo, name) => {
    if (!screenshotProjects.has(testInfo.project.name)) {
        return;
    }

    mkdirSync(screenshotsDirectory, {recursive: true});
    await waitForStableLayout(page);
    await revealFullPage(page);
    await page.screenshot({
        path: `${screenshotsDirectory}/${name}-${testInfo.project.name}.png`,
        fullPage: true,
    });
};

const openMobileMenu = async (page) => {
    const burger = page.getByRole('button', {name: 'Открыть меню'});
    await burger.click();
    const dialog = page.getByRole('dialog', {name: 'Мобильное меню'});
    await expect(dialog).toBeVisible();
    return {burger, dialog};
};

test('RU homepage prioritizes identity, U2, career, and six supporting projects', async ({page}, testInfo) => {
    const applicationErrors = await preparePage(page);
    await gotoHydrated(page, '/');

    await expect(page.locator('[data-hero-identity]')).toContainText('Амиран Бестаев');
    await expect(page.locator('[data-hero-role]')).toHaveText('Frontend Engineer');
    await expect(page.locator('[data-hero-cta]')).toHaveCount(3);

    const featured = page.locator('[data-featured-case="u2"]');
    await expect(featured).toHaveCount(1);
    await expect(featured.locator('a[href="/projects/u2"]')).toHaveCount(1);
    await expect(featured.locator('a[href="https://u2.moscow/"][target="_blank"][rel="noreferrer"]')).toHaveCount(1);

    const supportingProjects = page.locator('#projects');
    const cards = supportingProjects.locator('[data-project-card]');
    await expect(cards).toHaveCount(6);
    await expect(cards.getByRole('heading', {name: 'U2', exact: true})).toHaveCount(0);
    await expect(cards.getByRole('heading', {name: 'Новая', exact: true})).toBeVisible();
    await expect(cards.locator('a[href="https://novaya.ru/"]')).toHaveCount(1);

    const career = page.locator('#experience');
    await expect(career.locator('[data-career-entry]')).toHaveCount(2);
    await expect(career.getByRole('heading', {name: 'IdaProject', exact: true})).toBeVisible();
    await expect(career.getByText('Июль 2024 — настоящее время', {exact: true})).toBeVisible();
    await expect(career.getByRole('heading', {name: 'O2', exact: true})).toBeVisible();
    await expect(career.getByText('Февраль 2021 — Июль 2024', {exact: true})).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, 'homepage');
    expectNoApplicationErrors(applicationErrors);
});

test('language switch preserves equivalent home and case routes with route-aware header links', async ({page}, testInfo) => {
    const applicationErrors = await preparePage(page);
    await gotoHydrated(page, '/');

    const languageToggle = page.locator('button.lang-toggle:visible');
    await expect(languageToggle).toBeVisible();
    await languageToggle.click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('[data-hero-identity]')).toContainText('Amiran Bestaev');
    await expect(page.locator('[data-hero-role]')).toHaveText('Frontend Engineer');
    await expect(page.getByText('I make interfaces for product services', {exact: false})).toBeVisible();

    await page.getByRole('link', {name: 'View U2', exact: true}).click();
    await expect(page).toHaveURL(/\/en\/projects\/u2$/);
    await expect(page.getByRole('heading', {name: 'U2', exact: true})).toBeVisible();
    await page.locator('button.lang-toggle:visible').click();
    await expect(page).toHaveURL(/\/projects\/u2$/);
    await expect(page.getByText('Цифровая витрина жилого комплекса', {exact: false})).toBeVisible();

    const header = page.locator('.site-header');
    await expect(header.locator('a.active')).toHaveCount(0);
    await expect(header.locator('a[aria-current]')).toHaveCount(0);

    if (testInfo.project.name === 'desktop-chromium') {
        const navigation = page.getByRole('navigation', {name: 'Основная навигация'});
        const projectsLink = navigation.getByRole('link', {name: 'Проекты', exact: true});
        await expect(projectsLink).toHaveAttribute('href', '/#projects');
        await projectsLink.click();
    } else {
        const {dialog} = await openMobileMenu(page);
        const projectsLink = dialog.getByRole('link', {name: 'Проекты', exact: true});
        await expect(projectsLink).toHaveAttribute('href', '/#projects');
        await projectsLink.click();
    }

    await expect(page).toHaveURL(/\/#projects$/);
    const readProjectsGeometry = () => page.evaluate(() => {
        const target = document.getElementById('projects');
        const rect = target?.getBoundingClientRect();
        return {
            inViewport: Boolean(rect && rect.top < window.innerHeight && rect.bottom > 0),
            scrollY: window.scrollY,
            targetTop: rect?.top,
        };
    });
    await expect.poll(async () => (await readProjectsGeometry()).inViewport).toBe(true).catch(async (error) => {
        throw new Error(`${error.message}\nPost-navigation geometry: ${JSON.stringify(await readProjectsGeometry())}`);
    });
    expectNoApplicationErrors(applicationErrors);
});

test('U2 case shows real local gallery media and safe external navigation', async ({page}, testInfo) => {
    const applicationErrors = await preparePage(page);
    await gotoHydrated(page, '/projects/u2');

    await expect(page.getByRole('heading', {name: 'U2', exact: true, level: 1})).toBeVisible();
    await expect(page.locator('[data-case-fact]')).toHaveCount(4);
    await expect(page.locator('[data-case-narrative]')).toHaveCount(4);
    const media = page.locator('[data-case-media]');
    await expect(media).toHaveCount(4);
    await expect(media.locator('picture')).toHaveCount(4);
    await expect(media.locator('source[type="image/avif"]')).toHaveCount(4);
    await expect(media.locator('img')).toHaveCount(4);

    const localSources = await media.locator('picture').evaluateAll((pictures) => pictures.map((picture) => ({
        avif: picture.querySelector('source')?.getAttribute('srcset'),
        webp: picture.querySelector('img')?.getAttribute('src'),
    })));
    expect(localSources).toHaveLength(4);
    for (const source of localSources) {
        expect(source.avif).toMatch(/^\/projects\/u2\/.+\.avif$/);
        expect(source.webp).toMatch(/^\/projects\/u2\/.+\.webp$/);
    }

    await expect(page.locator('a[href="https://u2.moscow/"][target="_blank"][rel="noreferrer"]')).toHaveCount(2);
    await expect(page.locator('a[href="https://novaya.ru/"][target="_blank"][rel="noreferrer"]')).toHaveCount(1);
    await expectNoHorizontalOverflow(page);
    await saveScreenshot(page, testInfo, 'u2-case');
    expectNoApplicationErrors(applicationErrors);
});

test('390px homepage keeps the complete hero and accessible mobile menu above the fold', async ({page}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-390', '390x844 acceptance is specific to the mobile-390 project');
    const applicationErrors = await preparePage(page);
    await gotoHydrated(page, '/');
    await waitForStableLayout(page);

    const viewport = await page.evaluate(() => ({width: window.innerWidth, height: window.innerHeight}));
    expect(viewport).toEqual({width: 390, height: 844});
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator('[data-hero-identity]')).toBeVisible();
    await expect(page.locator('[data-hero-role]')).toBeVisible();
    await expect(page.locator('.hero__subtitle')).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const ctaBoxes = await page.locator('[data-hero-cta]').evaluateAll((elements) => elements.map((element) => {
        const box = element.getBoundingClientRect();
        return {left: box.left, right: box.right, bottom: box.bottom, width: box.width, height: box.height};
    }));
    expect(ctaBoxes).toHaveLength(3);
    for (const box of ctaBoxes) {
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
        expect(box.left).toBeGreaterThanOrEqual(0);
        expect(box.right).toBeLessThanOrEqual(390);
        expect(box.bottom).toBeLessThanOrEqual(844);
    }

    const {burger, dialog} = await openMobileMenu(page);
    await expect(dialog.getByRole('button', {name: 'Закрыть меню'})).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(burger).toBeFocused();
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
    expectNoApplicationErrors(applicationErrors);
});

test('command palette traps focus and navigates to Projects', async ({page}, testInfo) => {
    const applicationErrors = await preparePage(page);
    await gotoHydrated(page, '/');

    await page.keyboard.press('ControlOrMeta+K');
    const palette = page.getByRole('dialog', {name: 'Командная палитра'});
    await expect(palette).toBeVisible();
    expect(await palette.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    await palette.getByRole('link', {name: /Проекты/}).click();
    await expect(palette).toBeHidden();
    await expect(page).toHaveURL(/\/#projects$/);
    await expect(page.locator('#projects')).toBeInViewport();

    if (testInfo.project.name === 'desktop-chromium') {
        const opener = page.getByRole('button', {name: 'Открыть командную палитру'});
        await opener.focus();
        await page.keyboard.press('ControlOrMeta+K');
        await expect(palette).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(palette).toBeHidden();
        await expect(opener).toBeFocused();
    } else {
        const {burger, dialog} = await openMobileMenu(page);
        await dialog.getByRole('button', {name: 'Открыть командную палитру'}).click();
        await expect(palette).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(palette).toBeHidden();
        await expect(burger).toBeFocused();
    }

    expectNoApplicationErrors(applicationErrors);
});

test('dark theme persists from the homepage to the U2 case', async ({page}, testInfo) => {
    const applicationErrors = await preparePage(page);
    await page.addInitScript(() => window.localStorage.setItem('theme', 'light'));
    await gotoHydrated(page, '/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    if (testInfo.project.name === 'desktop-chromium') {
        await page.getByRole('button', {name: 'Переключить на тёмную тему'}).click();
    } else {
        const {dialog} = await openMobileMenu(page);
        await dialog.getByRole('button', {name: 'Переключить на тёмную тему'}).click();
        await page.keyboard.press('Escape');
    }

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('link', {name: 'Смотреть U2', exact: true}).click();
    await expect(page).toHaveURL(/\/projects\/u2$/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expectNoApplicationErrors(applicationErrors);
});

test('failed U2 AVIF and WebP assets reveal stable gallery fallbacks', async ({page}) => {
    const applicationErrors = await preparePage(page, {allowExpectedImage404: true});
    await page.route(u2Asset, (route) => route.fulfill({status: 404, body: ''}));
    await gotoHydrated(page, '/projects/u2');

    const media = page.locator('[data-case-media]');
    await expect(media).toHaveCount(4);
    for (let index = 0; index < await media.count(); index += 1) {
        await media.nth(index).scrollIntoViewIfNeeded();
        await expect(media.nth(index).locator('.case-media__fallback')).toBeVisible();
    }
    const boxes = await media.locator('.case-media__visual').evaluateAll((elements) => elements.map((element) => {
        const box = element.getBoundingClientRect();
        return {width: box.width, height: box.height};
    }));
    for (const box of boxes) {
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
    }
    await expect(media.locator('figcaption:visible')).toHaveCount(4);
    expectNoApplicationErrors(applicationErrors);
});

test('homepage font requests stay on the compact upright WOFF2', async ({page}) => {
    const applicationErrors = await preparePage(page);
    await gotoHydrated(page, '/');
    await page.evaluate(() => document.fonts.ready);

    const resources = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => ({
        name: entry.name,
        transferSize: entry.transferSize,
    })));
    const fonts = resources.filter(({name}) => new URL(name).pathname.endsWith('.woff2'));
    expect(fonts.some(({name}) => new URL(name).pathname.endsWith('/Montserrat-VariableFont_wght.woff2'))).toBe(true);
    expect(fonts.some(({name}) => /Italic/i.test(new URL(name).pathname))).toBe(false);
    expect(resources.some(({name}) => new URL(name).pathname.endsWith('.ttf'))).toBe(false);

    const transferredFonts = fonts.filter(({transferSize}) => transferSize > 0);
    if (transferredFonts.length) {
        const initialFontTransfer = transferredFonts.reduce((total, {transferSize}) => total + transferSize, 0);
        expect(initialFontTransfer).toBeLessThan(250000);
    }
    expectNoApplicationErrors(applicationErrors);
});

test.describe('reduced motion', () => {
    test.use({
        reducedMotion: 'reduce',
        colorScheme: 'dark',
        contextOptions: {reducedMotion: 'reduce'},
    });

    test('dark home and case content remains visible without reveal transforms', async ({page}) => {
        const applicationErrors = await preparePage(page);
        await gotoHydrated(page, '/');
        expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        await expect(page.locator('[data-project-card]')).toHaveCount(6);
        await expect(page.locator('[data-project-card]').first()).toBeVisible();

        const homeRevealStyles = await page.locator('.portfolio .reveal').evaluateAll((elements) => elements.map((element) => ({
            opacity: getComputedStyle(element).opacity,
            transform: getComputedStyle(element).transform,
        })));
        expect(homeRevealStyles.length).toBeGreaterThan(0);
        expect(homeRevealStyles.filter(({opacity, transform}) => (
            opacity !== '1'
            || !['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(transform)
        ))).toEqual([]);

        await gotoHydrated(page, '/projects/u2');
        expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        await expect(page.locator('[data-case-narrative]')).toHaveCount(4);
        await expect(page.locator('[data-case-narrative]').first()).toBeVisible();
        const caseRevealStyles = await page.locator('[data-case-page] .reveal').evaluateAll((elements) => elements.map((element) => ({
            opacity: getComputedStyle(element).opacity,
            transform: getComputedStyle(element).transform,
        })));
        expect(caseRevealStyles.length).toBeGreaterThan(0);
        expect(caseRevealStyles.filter(({opacity, transform}) => (
            opacity !== '1'
            || !['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(transform)
        ))).toEqual([]);
        expectNoApplicationErrors(applicationErrors);
    });
});

test.describe('no-JavaScript SSR', () => {
    test.use({javaScriptEnabled: false});

    test('homepage and U2 case expose complete content and real links without hydration', async ({page}) => {
        const applicationErrors = await preparePage(page);
        await page.goto('/');
        await expect(page.locator('[data-hero-identity]')).toContainText('Амиран Бестаев');
        await expect(page.locator('[data-hero-role]')).toHaveText('Frontend Engineer');
        await expect(page.locator('[data-featured-case="u2"]')).toBeVisible();
        await expect(page.locator('[data-career-entry]')).toHaveCount(2);
        await expect(page.locator('[data-project-card]')).toHaveCount(6);

        await page.goto('/projects/u2');
        await expect(page.getByRole('heading', {name: 'U2', exact: true, level: 1})).toBeVisible();
        await expect(page.locator('[data-case-fact]')).toHaveCount(4);
        await expect(page.locator('[data-case-narrative]')).toHaveCount(4);
        await expect(page.locator('[data-case-media]')).toHaveCount(4);
        await expect(page.locator('[data-case-media] figcaption')).toHaveCount(4);
        await expect(page.locator('[data-case-narrative]').first()).toBeVisible();
        await expect(page.locator('[data-case-media] figcaption').first()).toBeVisible();

        const primaryNavigation = page.locator('.site-header nav').first();
        await expect(primaryNavigation.locator('a[href="/#experience"]')).toHaveCount(1);
        await expect(primaryNavigation.locator('a[href="/#projects"]')).toHaveCount(1);
        await expect(page.locator('.case-navigation a[href="/"]')).toHaveCount(1);
        await expect(page.locator('.case-navigation a[href="https://u2.moscow/"]')).toHaveCount(1);
        await expect(page.locator('.case-navigation a[href="https://novaya.ru/"]')).toHaveCount(1);
        expectNoApplicationErrors(applicationErrors);
    });
});
