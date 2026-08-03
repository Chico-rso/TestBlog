import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import test from 'node:test'

const assetDirectory = new URL('../public/projects/u2/', import.meta.url)
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
	}
})
