import fs from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { execa } from 'execa'

// This script is executed from `<talk>/src`, e.g. `2026-10-08/src`.
const cwd = process.cwd()
const folder = basename(dirname(cwd))
const root = dirname(dirname(cwd))

const year = folder.slice(0, 4)
if (!/^\d{4}$/.test(year))
  throw new Error(`Cannot derive a year from the talk folder "${folder}"`)

const pkg = JSON.parse(await fs.readFile(join(cwd, 'package.json'), 'utf-8')) as { name: string }
const base = `/${year}/${pkg.name}/`
const out = resolve(root, 'dist', year, pkg.name)

console.log(`Building ${folder} → ${base}`)

await execa(
  'npx',
  ['slidev', 'build', '--base', base, '--out', out, ...process.argv.slice(2)],
  { cwd, stdio: 'inherit' },
)
