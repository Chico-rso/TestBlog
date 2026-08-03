import {defineConfig, devices} from 'playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: 'portfolio-ui.spec.js',
    fullyParallel: false,
    workers: 1,
    outputDir: 'output/playwright/test-results',
    reporter: [
        ['list'],
        ['html', {outputFolder: 'output/playwright/report', open: 'never'}],
    ],
    webServer: {
        command: 'env HOST=127.0.0.1 PORT=3100 node .output/server/index.mjs',
        url: 'http://127.0.0.1:3100',
        reuseExistingServer: false,
        timeout: 120000,
    },
    use: {
        baseURL: 'http://127.0.0.1:3100',
        trace: 'retain-on-failure',
    },
    projects: [
        {name: 'desktop-chromium', use: {...devices['Desktop Chrome']}},
        {name: 'mobile-chromium', use: {...devices['Pixel 7']}},
        {
            name: 'mobile-390',
            use: {
                viewport: {width: 390, height: 844},
                isMobile: true,
                hasTouch: true,
                userAgent: devices['Pixel 7'].userAgent,
                deviceScaleFactor: devices['Pixel 7'].deviceScaleFactor,
            },
        },
    ],
});
