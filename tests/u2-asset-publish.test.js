import assert from 'node:assert/strict'
import { access, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'
import { publishDirectoryAtomic } from '../scripts/lib/publish-u2-assets.mjs'

async function createDirectoryWithFile(directory, filename, contents)
{
	await mkdir(directory, { recursive: true })
	await writeFile(join(directory, filename), contents)
}

test('atomic U2 publish restores the complete previous asset set when the swap fails', async () =>
{
	const rootDirectory = await mkdtemp(join(tmpdir(), 'u2-publish-test-'))
	const destinationDirectory = join(rootDirectory, 'u2')
	const stagingDirectory = join(rootDirectory, 'u2-staging')
	const backupDirectory = join(rootDirectory, 'u2-backup')

	try
	{
		await createDirectoryWithFile(destinationDirectory, 'old.webp', 'old complete asset set')
		await createDirectoryWithFile(stagingDirectory, 'new.webp', 'new complete asset set')
		let renameCalls = 0

		await assert.rejects(
			publishDirectoryAtomic({
				stagingDirectory,
				destinationDirectory,
				backupDirectory,
				renameDirectory: async (source, destination) =>
				{
					renameCalls += 1

					if (renameCalls === 2)
					{
						throw new Error('injected staging swap failure')
					}

					await rename(source, destination)
				}
			}),
			/injected staging swap failure/
		)

		assert.equal(await readFile(join(destinationDirectory, 'old.webp'), 'utf8'), 'old complete asset set')
		await assert.rejects(access(join(destinationDirectory, 'new.webp')))
		assert.equal(await readFile(join(stagingDirectory, 'new.webp'), 'utf8'), 'new complete asset set')
		await assert.rejects(access(backupDirectory))
	}
	finally
	{
		await rm(rootDirectory, { recursive: true, force: true })
	}
})

test('atomic U2 publish creates a sibling backup for destination paths with trailing slashes', async () =>
{
	const rootDirectory = await mkdtemp(join(tmpdir(), 'u2-publish-test-'))
	const destinationDirectory = `${join(rootDirectory, 'u2')}/`
	const stagingDirectory = join(rootDirectory, 'u2-staging')

	try
	{
		await createDirectoryWithFile(destinationDirectory, 'old.webp', 'old complete asset set')
		await createDirectoryWithFile(stagingDirectory, 'new.webp', 'new complete asset set')

		await publishDirectoryAtomic({ stagingDirectory, destinationDirectory })

		assert.equal(await readFile(join(destinationDirectory, 'new.webp'), 'utf8'), 'new complete asset set')
		await assert.rejects(access(join(destinationDirectory, 'old.webp')))
	}
	finally
	{
		await rm(rootDirectory, { recursive: true, force: true })
	}
})

test('atomic U2 publish preserves the backup when rollback itself fails', async () =>
{
	const rootDirectory = await mkdtemp(join(tmpdir(), 'u2-publish-test-'))
	const destinationDirectory = join(rootDirectory, 'u2')
	const stagingDirectory = join(rootDirectory, 'u2-staging')
	const backupDirectory = join(rootDirectory, 'u2-backup')

	try
	{
		await createDirectoryWithFile(destinationDirectory, 'old.webp', 'old complete asset set')
		await createDirectoryWithFile(stagingDirectory, 'new.webp', 'new complete asset set')
		let renameCalls = 0

		await assert.rejects(
			publishDirectoryAtomic({
				stagingDirectory,
				destinationDirectory,
				backupDirectory,
				renameDirectory: async (source, destination) =>
				{
					renameCalls += 1

					if (renameCalls === 2 || renameCalls === 3)
					{
						throw new Error('injected swap and rollback failure')
					}

					await rename(source, destination)
				}
			}),
			/backup preserved/
		)

		assert.equal(await readFile(join(backupDirectory, 'old.webp'), 'utf8'), 'old complete asset set')
		await assert.rejects(access(destinationDirectory))
	}
	finally
	{
		await rm(rootDirectory, { recursive: true, force: true })
	}
})
