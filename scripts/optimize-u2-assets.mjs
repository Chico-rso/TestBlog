import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { publishDirectoryAtomic } from './lib/publish-u2-assets.mjs'

const sourceDirectory = fileURLToPath(new URL('../output/u2-source/', import.meta.url))
const destinationDirectory = fileURLToPath(new URL('../public/projects/u2/', import.meta.url))
const assets = [
	['u2-home-desktop.png', 'u2-home-desktop'],
	['u2-filters-desktop.png', 'u2-filters-desktop'],
	['u2-flat-desktop.png', 'u2-flat-desktop'],
	['u2-filters-mobile.png', 'u2-filters-mobile']
]

await mkdir(dirname(destinationDirectory), { recursive: true })
const temporaryDirectory = await mkdtemp(join(dirname(destinationDirectory), 'u2-staging-'))

try
{
	for (const [sourceName, destinationName] of assets)
	{
		const sourcePath = `${sourceDirectory}/${sourceName}`
		const temporaryPath = join(temporaryDirectory, destinationName)

		await sharp(sourcePath)
			.avif({ quality: 64, effort: 6 })
			.toFile(`${temporaryPath}.avif`)
		await sharp(sourcePath)
			.webp({ quality: 76, effort: 6 })
			.toFile(`${temporaryPath}.webp`)
	}

	await publishDirectoryAtomic({
		stagingDirectory: temporaryDirectory,
		destinationDirectory
	})
}
finally
{
	await rm(temporaryDirectory, { recursive: true, force: true })
}
