import fs from 'node:fs/promises'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
import prompts from 'prompts'
import { execa, type ResultPromise } from 'execa'

/** URL the Slidev dev server is served on by default. */
const DEV_URL = 'http://localhost:3030'

/** Open a URL in the user's default browser. */
async function openBrowser(url: string) {
  const [command, ...args] = process.platform === 'darwin'
    ? ['open', url]
    : process.platform === 'win32'
      ? ['cmd', '/c', 'start', '', url]
      : ['xdg-open', url]

  await execa(command, args).catch((error) => {
    console.warn(`Failed to open the browser: ${error.shortMessage ?? error.message}`)
  })
}

/**
 * Wait until the dev server at `url` accepts connections, or the process
 * exits early / the timeout is reached.
 */
async function waitForServer(url: string, child: ResultPromise, timeout = 30_000) {
  const deadline = Date.now() + timeout

  while (Date.now() < deadline) {
    if (child.nodeChildProcess.exitCode !== null)
      return false

    try {
      await fetch(url)
      return true
    }
    catch {
      await delay(200)
    }
  }

  return false
}

async function startPicker(args: string[]) {
  const folders = (await fs.readdir(new URL('..', import.meta.url), { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(folder => folder.match(/^\d{4}-/))
    .sort((a, b) => -a.localeCompare(b))

  const result = args.includes('-y')
    ? { folder: folders[0] }
    : await prompts([
      {
        type: 'select',
        name: 'folder',
        message: 'Pick a folder',
        choices: folders.map(folder => ({ title: folder, value: folder })),
      },
    ])

  args = args.filter(arg => arg !== '-y')

  if (!result.folder)
    return

  const cwd = new URL(`../${result.folder}/src`, import.meta.url)

  if (args[0] === 'dev') {
    const dev = execa('pnpm', ['run', ...args], { cwd, stdio: 'inherit' })
    if (await waitForServer(DEV_URL, dev)) {
      console.log(`Opening ${DEV_URL} in the browser`)
      await openBrowser(DEV_URL)
    }
    await dev
    return
  }

  await execa('pnpm', ['run', ...args], {
    cwd,
    stdio: 'inherit',
  })
}

await startPicker(process.argv.slice(2))
