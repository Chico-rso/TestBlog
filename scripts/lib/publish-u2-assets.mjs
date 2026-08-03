import { access, rename, rm } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { basename, dirname, join, resolve } from 'node:path'

async function pathExists(path)
{
	try
	{
		await access(path)
		return true
	}
	catch (error)
	{
		if (error.code === 'ENOENT')
		{
			return false
		}

		throw error
	}
}

export async function publishDirectoryAtomic({
	stagingDirectory,
	destinationDirectory,
	backupDirectory,
	renameDirectory = rename,
	removeDirectory = rm,
	directoryExists = pathExists
})
{
	const normalizedDestinationDirectory = resolve(destinationDirectory)
	const resolvedBackupDirectory = backupDirectory ?? join(
		dirname(normalizedDestinationDirectory),
		`${basename(normalizedDestinationDirectory)}-backup-${randomUUID()}`
	)
	const destinationExists = await directoryExists(normalizedDestinationDirectory)

	if (!destinationExists)
	{
		await renameDirectory(stagingDirectory, normalizedDestinationDirectory)
		return
	}

	await renameDirectory(normalizedDestinationDirectory, resolvedBackupDirectory)

	try
	{
		await renameDirectory(stagingDirectory, normalizedDestinationDirectory)
	}
	catch (publishError)
	{
		try
		{
			await renameDirectory(resolvedBackupDirectory, normalizedDestinationDirectory)
		}
		catch (rollbackError)
		{
			throw new AggregateError(
				[publishError, rollbackError],
				`U2 asset publish failed and rollback failed; backup preserved at ${resolvedBackupDirectory}`
			)
		}

		throw publishError
	}

	await removeDirectory(resolvedBackupDirectory, { recursive: true, force: true })
}
