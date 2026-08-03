import {mkdirSync} from 'node:fs';

import {expect, test} from 'playwright/test';

test('renders unique project cases in RU and EN without overflow', async ({page}, testInfo) => {
    const consoleErrors = [];
    await page.route('https://mc.yandex.ru/**', (route) => route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
    }));
    page.on('console', (message) => {
        if (message.type() === 'error') {
            consoleErrors.push(message.text());
        }
    });

    await page.goto('/');
    const work = page.locator('#work');
    await work.scrollIntoViewIfNeeded();

    const cards = work.locator('[data-project-card]');
    await expect(cards).toHaveCount(7);
    await expect(work.getByRole('heading', {name: 'Новая'})).toBeVisible();
    await expect(work.getByText('FoodMap Delivery')).toHaveCount(0);
    await expect(work.locator('a[href="https://vkusnoibistro.com/application/"]')).toHaveCount(1);
    await expect(work.locator('a[href="https://novaya.ru/"]')).toHaveCount(1);
    await expect(work.getByText('Интерактивный генплан и оптимизация производительности')).toBeVisible();

    for (let index = 0; index < await cards.count(); index += 1) {
        await cards.nth(index).scrollIntoViewIfNeeded();
        await expect(cards.nth(index)).toBeVisible();
    }

    mkdirSync('output/playwright', {recursive: true});
    await work.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    const header = page.locator('.site-header');
    await header.evaluate((element) => {
        element.style.visibility = 'hidden';
    });
    await work.screenshot({
        path: `output/playwright/portfolio-work-${testInfo.project.name}.png`,
    });
    await header.evaluate((element) => {
        element.style.visibility = '';
    });

    await page.locator('button.lang-toggle:visible').click();
    await expect(work.getByRole('heading', {name: 'Novaya'})).toBeVisible();
    await expect(work.getByText('Interactive masterplan and performance optimization')).toBeVisible();

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasOverflow).toBe(false);
    expect(consoleErrors).toEqual([]);
});

test.describe('reduced motion', () => {
    test.use({reducedMotion: 'reduce', colorScheme: 'dark'});

    test('theme and reduced motion keep project content usable', async ({page}) => {
        await page.goto('/');
        await page.locator('#work').scrollIntoViewIfNeeded();

        await expect(page.locator('[data-project-card]').first()).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        const transform = await page.locator('[data-project-card]').first()
            .evaluate((card) => getComputedStyle(card).transform);
        expect(transform === 'none' || transform.includes('matrix(1, 0, 0, 1')).toBe(true);
    });
});
