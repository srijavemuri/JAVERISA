import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()

function standaloneFilePlugin() {
  return {
    name: 'javerisa-standalone-file',
    apply: 'build',
    async closeBundle() {
      const outputDirectory = path.join(projectRoot, 'dist')
      const builtHtmlPath = path.join(outputDirectory, 'index.html')
      let html = await readFile(builtHtmlPath, 'utf8')

      html = html.replace(
        /<script\b[^>]*src="([^"]+\.js)"[^>]*><\/script>/,
        (_tag, assetPath) => `<script defer src="./dist/${assetPath.replace(/^\.\//, '')}"></script>`,
      )
      html = html.replace(
        /<link\b[^>]*href="([^"]+\.css)"[^>]*>/,
        (_tag, assetPath) => `<link rel="stylesheet" href="./dist/${assetPath.replace(/^\.\//, '')}" />`,
      )

      await writeFile(path.join(projectRoot, 'index.html'), html, 'utf8')
    },
  }
}

export default defineConfig({
  root: path.join(projectRoot, 'src'),
  base: './',
  publicDir: path.join(projectRoot, 'public'),
  build: {
    outDir: path.join(projectRoot, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
  plugins: [react(), standaloneFilePlugin()],
})