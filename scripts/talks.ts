import fs from 'node:fs/promises'

export interface Talk {
  /** Talk folder name, e.g. `2026-10-08`. */
  folder: string
  /** Year extracted from the folder, e.g. `2026`. */
  year: string
  /** Slug from `<folder>/src/package.json` `name`, e.g. `vincents-agent-use`. */
  name: string
  /** Sub-route the deck is served under, e.g. `/2026/vincents-agent-use/`. */
  base: string
  /** Title parsed from the talk `README.md`, if any. */
  title: string
}

const root = new URL('..', import.meta.url)

/** Discover every `YYYY-*` talk folder, newest first. */
export async function discoverTalks(): Promise<Talk[]> {
  const folders = (await fs.readdir(root, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(folder => /^\d{4}-/.test(folder))
    .sort((a, b) => b.localeCompare(a))

  return Promise.all(folders.map(async (folder) => {
    const year = folder.slice(0, 4)
    const pkg = JSON.parse(await fs.readFile(new URL(`../${folder}/src/package.json`, import.meta.url), 'utf-8')) as { name: string }
    const readme = await fs.readFile(new URL(`../${folder}/README.md`, import.meta.url), 'utf-8').catch(() => '')
    const title = readme.match(/^# (.*)/m)?.[1].trim() ?? ''

    return { folder, year, name: pkg.name, base: `/${year}/${pkg.name}/`, title }
  }))
}
