import fs from 'node:fs/promises'
import { discoverTalks } from './talks'

const talks = await discoverTalks()

const talkRedirects = talks
  .flatMap(({ folder, base }) => [
    '[[redirects]]',
    `from = "/${folder}"`,
    `to = "${base}"`,
    'status = 301',
    '',
    '[[redirects]]',
    `from = "${base}*"`,
    `to = "${base}index.html"`,
    'status = 200',
  ])
  .join('\n')

const content = `[build]
publish = "dist"
command = "pnpm run build"

[build.environment]
NODE_VERSION = "20"

[[redirects]]
from = "/.well-known/*"
to = "/.well-known/:splat"
status = 200

${talkRedirects}

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
`

await fs.writeFile(new URL('../netlify.toml', import.meta.url), content, 'utf-8')

console.log(`Generated netlify.toml with ${talks.length} talk(s)`)
