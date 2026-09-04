import { defineConfig } from 'vite'

const removeStylesheetCrossorigin = {
  name: 'remove-stylesheet-crossorigin',
  transformIndexHtml: {
    order: 'post' as const,
    handler: (html: string) => html.replace(
      /(<link\b[^>]*\brel=["']stylesheet["'][^>]*)\s+crossorigin(?=[^>]*>)/gi,
      '$1',
    ),
  },
}

export default defineConfig({
  assetsInclude: ['**/*.glb'],
  plugins: [removeStylesheetCrossorigin],
})
