import {defineConfig, devices} from 'playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: 'portfolio-ui.spec.js',
    webServer: {
        command: 'npm run dev -- --host 127.0.0.1 --port 3100',
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
    ],
});
