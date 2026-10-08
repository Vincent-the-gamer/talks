# Vincent's Talks

Slides & code for my talks, using [Slidev](https://github.com/slidevjs/slidev)!

Each talk lives in its own date-prefixed folder (e.g. `2026-10-08/`), with the
deck under `<talk folder>/src/slides.md` and the speaker script under
`<talk folder>/content.md`.

Every talk is served as its own sub-route, built from the year of its folder
plus the `name` in `<talk folder>/src/package.json`:

```
/2026/vincents-agent-use/        → 2026-10-08 (package name `vincents-agent-use`)
/2026/vincents-agent-use/3       → slide 3
```

This way multiple talks can be built into the same site and browsed side by
side, sharing a single origin.

## Catalogue

###### 2026-10-08

 - `zh` [又懒又穷的我，使用 Agent 的过程](./2026-10-08) - 诡锋的第一期杂谈

## Requirements

- [Node.js](https://nodejs.org/) 24+
- [pnpm](https://pnpm.io/)

## Development

Install dependencies once:

```bash
pnpm install
```

Then start the dev server:

```bash
pnpm dev
```

You'll be prompted to pick a talk. The dev server auto-opens the talk's sub-route,
e.g. <http://localhost:3030/2026/vincents-agent-use/>.

Pass `-y` to skip the prompt and open the most recent talk:

```bash
pnpm dev -y
```

Edit `<your talk folder>/src/slides.md` to see the changes.

Learn more about Slidev at the [documentation](https://sli.dev/).

### Build

To build every talk into the shared `dist/` (one folder per sub-route, plus an
index page listing them all), run

```bash
pnpm build
```

To build a single talk, run

```bash
pnpm build:talk
```

### Export to PDF

To export the slides of a talk to PDF, run

```bash
pnpm export
```

The PDF will be generated at `<your talk folder>/slides.pdf`.

### Lint & typecheck

```bash
pnpm lint
pnpm typecheck
```

## Adding a new talk

1. Create a folder named `YYYY-MM-DD` (e.g. `2026-11-01`).
2. Copy the `src/` folder from an existing talk — it contains the Slidev deck,
   `package.json`, and styles.
3. Set the `name` in `<your talk folder>/src/package.json` — it becomes the
   sub-route slug (e.g. `name: "vincent-agent-use"` → `/2026/vincent-agent-use/`).
4. Write your slides in `<your talk folder>/src/slides.md`.
5. Add the talk to the [Catalogue](#catalogue) above.
6. Regenerate the hosting redirects so deep links (like `/2026/my-talk/3`) work:

   ```bash
   pnpm redirects
   ```

   Commit the updated `netlify.toml` — the host reads it before building.

The `pnpm dev`, `pnpm build` and `pnpm export` scripts auto-discover every
`YYYY-MM-DD` folder, so no other registration is needed.
