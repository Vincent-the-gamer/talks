# Vincent's Talks

Slides & code for my talks, using [Slidev](https://github.com/slidevjs/slidev)!

Each talk lives in its own date-prefixed folder (e.g. `2026-10-08/`), with the
deck under `<talk folder>/src/slides.md` and the speaker script under
`<talk folder>/content.md`.

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

You'll be prompted to pick a talk. Once it's up, visit <http://localhost:3030>.

Pass `-y` to skip the prompt and open the most recent talk:

```bash
pnpm dev -y
```

Edit `<your talk folder>/src/slides.md` to see the changes.

Learn more about Slidev at the [documentation](https://sli.dev/).

### Build

To build the slide website of a talk, run

```bash
pnpm build
```

To build every talk at once, run

```bash
pnpm build:all
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
3. Write your slides in `<your talk folder>/src/slides.md`.
4. Add the talk to the [Catalogue](#catalogue) above.

The `pnpm dev`, `pnpm build` and `pnpm export` scripts auto-discover every
`YYYY-MM-DD` folder, so no other registration is needed.
