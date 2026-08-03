import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import sharp from 'sharp'

const assetDirectory = new URL('../public/projects/u2/', import.meta.url)
const projectRoot = new URL('../', import.meta.url)
const assetNames = [
	'u2-home-desktop.avif',
	'u2-home-desktop.webp',
	'u2-filters-desktop.avif',
	'u2-filters-desktop.webp',
	'u2-flat-desktop.avif',
	'u2-flat-desktop.webp',
	'u2-filters-mobile.avif',
	'u2-filters-mobile.webp'
]
const expectedDimensions = {
	'u2-home-desktop': { width: 1600, height: 1000 },
	'u2-filters-desktop': { width: 1600, height: 1000 },
	'u2-flat-desktop': { width: 1600, height: 1000 },
	'u2-filters-mobile': { width: 780, height: 1688 }
}

test('public CV is the approved resume PDF', async () =>
{
	const contents = await readFile(new URL('public/cv-amiran-bestaev.pdf', projectRoot))
	const checksum = createHash('sha256').update(contents).digest('hex')

	assert.equal(contents.subarray(0, 5).toString(), '%PDF-')
	assert.equal(checksum, '89d1bc6dc8f5a9d06877eb734b49ce4624931d820b1a73680707c6c077ab7307')
})

test('U2 evidence assets exist and are meaningful image files', async () =>
{
	for (const assetName of assetNames)
	{
		const assetUrl = new URL(assetName, assetDirectory)
		const [fileStats, contents] = await Promise.all([stat(assetUrl), readFile(assetUrl)])

		assert.ok(fileStats.size > 10_000, `${assetName} must exceed 10,000 bytes`)

		if (assetName.endsWith('.avif'))
		{
			assert.equal(contents.subarray(4, 12).toString(), 'ftypavif')
		}
		else
		{
			assert.equal(contents.subarray(0, 4).toString(), 'RIFF')
			assert.equal(contents.subarray(8, 12).toString(), 'WEBP')
		}

		const { data, info } = await sharp(fileURLToPath(assetUrl))
			.raw()
			.toBuffer({ resolveWithObject: true })
		const expectedSize = expectedDimensions[assetName.replace(/\.(avif|webp)$/, '')]

		assert.equal(info.width, expectedSize.width, `${assetName} width`)
		assert.equal(info.height, expectedSize.height, `${assetName} height`)
		assert.ok(data.length > 0, `${assetName} must decode into pixels`)
	}
})

test('U2 capture pipeline declares its runtime, source exclusion, and readiness safeguards', async () =>
{
	const [packageContents, gitignoreContents, captureContents] = await Promise.all([
		readFile(new URL('package.json', projectRoot), 'utf8'),
		readFile(new URL('.gitignore', projectRoot), 'utf8'),
		readFile(new URL('scripts/capture-u2-assets.mjs', projectRoot), 'utf8')
	])
	const packageJson = JSON.parse(packageContents)

	assert.equal(packageJson.engines?.node, '>=20.10.0')
	assert.match(gitignoreContents, /^output\/u2-source\/$/m)
	assert.match(captureContents, /response\.ok/)
	assert.match(captureContents, /document\.fonts\.ready/)
	assert.match(captureContents, /Timed out waiting for web fonts/)
	assert.match(captureContents, /const frozenVideoTime = 1/)
	assert.match(captureContents, /video\.currentTime = frozenVideoTime/)
	assert.match(captureContents, /video\.addEventListener\('seeked'/)
	assert.match(captureContents, /consentOverlay/)
})
