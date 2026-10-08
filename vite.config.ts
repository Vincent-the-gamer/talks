import { defineConfig } from 'vite'
import '@slidev/cli'
import MarkdownItMagicLink from 'markdown-it-magic-link'

export default defineConfig({
  // Vite 8 defaults to Lightning CSS, which rejects CSS that UnoCSS's
  // transformer-directives emits for `--uno:` directives: the empty-rule
  // cleanup re-appends already-inserted declarations as stray top-level rules
  // (a bug in @unocss/transformer-directives). Browsers ignore those
  // declarations, and esbuild (Vite's previous default minifier) tolerates them.
  build: {
    cssMinify: 'esbuild',
  },
  slidev: {
    markdown: {
      markdownSetup(md) {
        md.use(MarkdownItMagicLink, {
          linksMap: {
            'OpenCode': 'https://opencode.ai',
          },
        })
      },
    },
  },
})
