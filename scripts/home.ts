import fs from 'node:fs/promises'
import { discoverTalks } from './talks'

const root = new URL('..', import.meta.url)
const talks = await discoverTalks()

const years = [...new Set(talks.map(talk => talk.year))]

const sections = years.map((year) => {
  const items = talks
    .filter(talk => talk.year === year)
    .map(({ folder, base, title }) => `      <li>
        <a href="${base}">
          <time>${folder}</time>
          <span>${title || folder}</span>
        </a>
      </li>`)
    .join('\n')

  return `    <section>
      <h2>${year}</h2>
      <ul>
${items}
      </ul>
    </section>`
}).join('\n')

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Talks</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    background: #121212;
    color: #e5e5e5;
    font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
    line-height: 1.6;
  }
  main { width: min(48rem, 100%); padding: 5rem 1.5rem; }
  h1 { margin: 0 0 0.5rem; font-size: 2rem; }
  section { margin-top: 2.5rem; }
  h2 { font-size: 1rem; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.5; }
  ul { list-style: none; margin: 0; padding: 0; }
  li + li { border-top: 1px solid #2a2a2a; }
  a {
    display: flex;
    gap: 1rem;
    align-items: baseline;
    padding: 0.85rem 0.25rem;
    color: inherit;
    text-decoration: none;
    transition: color 0.15s ease;
  }
  a:hover { color: #4ade80; }
  time { flex: none; opacity: 0.45; font-variant-numeric: tabular-nums; font-size: 0.85rem; }
</style>
</head>
<body>
  <main>
    <h1>Talks</h1>
${sections}
  </main>
</body>
</html>
`

await fs.mkdir(new URL('dist', root), { recursive: true })
await fs.writeFile(new URL('dist/index.html', root), html, 'utf-8')

console.log(`Generated dist/index.html with ${talks.length} talk(s)`)
