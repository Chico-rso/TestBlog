import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium, errors } from 'playwright'

const sourceDirectory = fileURLToPath(new URL('../output/u2-source/', import.meta.url))
const consentButtonName = /принять|согласен|accept|хорошо/i
const frozenVideoTime = 1
const visualTimeout = 15_000
const captures = [
	{
		filename: 'u2-home-desktop.png',
		url: 'https://u2.moscow/',
		viewport: { width: 1600, height: 1000 },
		deviceScaleFactor: 1,
		sentinels: [
			{ name: 'home heading', text: 'Дом на спокойном берегу' },
			{ name: 'home detail', text: 'Камерный проект бизнес-класса воплощает баланс архитектуры и природы, технологичности и уюта.' }
		]
	},
	{
		filename: 'u2-filters-desktop.png',
		url: 'https://u2.moscow/flats',
		viewport: { width: 1600, height: 1000 },
		deviceScaleFactor: 1,
		sentinels: [
			{ name: 'filters heading', text: 'Подбор по параметрам' },
			{ name: 'filters control', text: 'Все фильтры' }
		]
	},
	{
		filename: 'u2-flat-desktop.png',
		url: 'https://u2.moscow/flats/453',
		viewport: { width: 1600, height: 1000 },
		deviceScaleFactor: 1,
		sentinels: [
			{ name: 'flat heading', text: '1-комнатная 38.5 м²' },
			{ name: 'flat detail', text: '100% оплата' }
		]
	},
	{
		filename: 'u2-filters-mobile.png',
		url: 'https://u2.moscow/flats',
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: 2,
		sentinels: [
			{ name: 'mobile filters heading', text: 'Подбор по параметрам' },
			{ name: 'mobile filters control', text: 'Все фильтры' }
		]
	}
]

async function waitForVisualReadiness(page, capture)
{
	for (const sentinel of capture.sentinels)
	{
		await page.getByText(sentinel.text, { exact: true }).first().waitFor({
			state: 'visible',
			timeout: visualTimeout
		})
	}

	await page.evaluate(timeout => new Promise((resolve, reject) =>
	{
		const timer = setTimeout(() => reject(new Error('Timed out waiting for web fonts')), timeout)

		document.fonts.ready.then(() =>
		{
			clearTimeout(timer)
			resolve()
		}, error =>
		{
			clearTimeout(timer)
			reject(error)
		})
	}), visualTimeout)
}

async function dismissAsyncConsent(page)
{
	const consentOverlay = page.getByRole('button', { name: consentButtonName }).first()

	try
	{
		await consentOverlay.waitFor({ state: 'visible', timeout: 5_000 })
	}
	catch (error)
	{
		if (error instanceof errors.TimeoutError)
		{
			return
		}

		throw error
	}

	await consentOverlay.click()
	await consentOverlay.waitFor({ state: 'hidden', timeout: visualTimeout })

	if (await consentOverlay.isVisible())
	{
		throw new Error('Cookie consent overlay remained visible after dismissal')
	}
}

async function freezeVideos(page)
{
	await page.locator('video').evaluateAll(async (videos, frozenVideoTime) =>
	{
		await Promise.all(videos.map(video => new Promise((resolve, reject) =>
		{
			if (video.readyState >= HTMLMediaElement.HAVE_METADATA)
			{
				resolve()
				return
			}

			const timeout = setTimeout(() => reject(new Error('Timed out waiting for video metadata')), 10_000)
			const onMetadata = () =>
			{
				clearTimeout(timeout)
				resolve()
			}
			const onError = () =>
			{
				clearTimeout(timeout)
				reject(new Error('Video failed before metadata loaded'))
			}

			video.addEventListener('loadedmetadata', onMetadata, { once: true })
			video.addEventListener('error', onError, { once: true })
		})))

		await Promise.all(videos.map(video => new Promise((resolve, reject) =>
		{
			video.pause()

			if (Math.abs(video.currentTime - frozenVideoTime) < 0.01)
			{
				resolve()
				return
			}

			const timeout = setTimeout(() => reject(new Error('Timed out seeking video to the frozen frame')), 10_000)
			const onSeeked = () =>
			{
				clearTimeout(timeout)
				resolve()
			}
			const onError = () =>
			{
				clearTimeout(timeout)
				reject(new Error('Video failed while seeking to the frozen frame'))
			}

			video.addEventListener('seeked', onSeeked, { once: true })
			video.addEventListener('error', onError, { once: true })
			video.currentTime = frozenVideoTime
		})))

		videos.forEach(video => video.pause())
	}, frozenVideoTime)
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
			const response = await page.goto(capture.url, { waitUntil: 'domcontentloaded', timeout: 30_000 })

			if (!response || !response.ok())
			{
				throw new Error(`Unable to load ${capture.url}: HTTP ${response?.status() ?? 'no response'}`)
			}

			await waitForVisualReadiness(page, capture)
			await dismissAsyncConsent(page)
			await freezeVideos(page)
			await page.waitForTimeout(500)
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
