import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const sourceDirectory = fileURLToPath(new URL('../output/u2-source/', import.meta.url))
const consentButtonName = /принять|согласен|accept|хорошо/i
const captures = [
	{
		filename: 'u2-home-desktop.png',
		url: 'https://u2.moscow/',
		viewport: { width: 1600, height: 1000 },
		deviceScaleFactor: 1
	},
	{
		filename: 'u2-filters-desktop.png',
		url: 'https://u2.moscow/flats',
		viewport: { width: 1600, height: 1000 },
		deviceScaleFactor: 1
	},
	{
		filename: 'u2-flat-desktop.png',
		url: 'https://u2.moscow/flats/453',
		viewport: { width: 1600, height: 1000 },
		deviceScaleFactor: 1
	},
	{
		filename: 'u2-filters-mobile.png',
		url: 'https://u2.moscow/flats',
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: 2
	}
]

async function waitForVisualReadiness(page)
{
	await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => {})
	await page.evaluate(async () =>
	{
		await Promise.race([
			document.fonts.ready,
			new Promise(resolve => setTimeout(resolve, 3_000))
		])
	})
	await page.waitForTimeout(1_500)
}

async function dismissConsent(page)
{
	const consentButton = page.getByRole('button', { name: consentButtonName }).first()

	if (await consentButton.count())
	{
		await consentButton.click({ timeout: 3_000 }).catch(() => {})
	}
}

await mkdir(sourceDirectory, { recursive: true })

const browser = await chromium.launch({ headless: true })

try
{
	for (const capture of captures)
	{
		const context = await browser.newContext({
			colorScheme: 'light',
			locale: 'ru-RU',
			viewport: capture.viewport,
			deviceScaleFactor: capture.deviceScaleFactor
		})

		try
		{
			const page = await context.newPage()
			await page.goto(capture.url, { waitUntil: 'domcontentloaded', timeout: 30_000 })
			await dismissConsent(page)
			await waitForVisualReadiness(page)
			await page.screenshot({
				path: `${sourceDirectory}/${capture.filename}`,
				animations: 'disabled'
			})
		}
		finally
		{
			await context.close()
		}
	}
}
finally
{
	await browser.close()
}
