import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
import { execa, type ResultPromise } from 'execa'
import prompts from 'prompts'
import { discoverTalks } from './talks'

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
  const talks = await discoverTalks()

  const result = args.includes('-y')
    ? { folder: talks[0]?.folder }
    : await prompts([
      {
        type: 'select',
        name: 'folder',
        message: 'Pick a talk',
        choices: talks.map(talk => ({
          title: talk.title ? `${talk.folder} | ${talk.title}` : talk.folder,
          value: talk.folder,
        })),
      },
    ])

  args = args.filter(arg => arg !== '-y')

  if (!result.folder)
    return

  const talk = talks.find(item => item.folder === result.folder)
  if (!talk)
    return

  const cwd = new URL(`../${talk.folder}/src`, import.meta.url)

  if (args[0] === 'dev') {
    const url = `${DEV_URL}${talk.base}`
    const dev = execa('pnpm', ['run', 'dev', '--base', talk.base], { cwd, stdio: 'inherit' })
    if (await waitForServer(url, dev)) {
      console.log(`Opening ${url} in the browser`)
      await openBrowser(url)
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
