import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const sourceDirectory = fileURLToPath(new URL('../output/u2-source/', import.meta.url))
const destinationDirectory = fileURLToPath(new URL('../public/projects/u2/', import.meta.url))
const assets = [
	['u2-home-desktop.png', 'u2-home-desktop'],
	['u2-filters-desktop.png', 'u2-filters-desktop'],
	['u2-flat-desktop.png', 'u2-flat-desktop'],
	['u2-filters-mobile.png', 'u2-filters-mobile']
]

await mkdir(destinationDirectory, { recursive: true })

for (const [sourceName, destinationName] of assets)
{
	const sourcePath = `${sourceDirectory}/${sourceName}`
	const destinationPath = `${destinationDirectory}/${destinationName}`

	await sharp(sourcePath)
		.avif({ quality: 64, effort: 6 })
		.toFile(`${destinationPath}.avif`)
	await sharp(sourcePath)
		.webp({ quality: 76, effort: 6 })
		.toFile(`${destinationPath}.webp`)
}
