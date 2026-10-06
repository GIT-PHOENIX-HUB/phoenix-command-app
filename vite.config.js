import { readFile, writeFile } from 'node:fs/promises'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  injectConnectSource,
  requireProductionRuntime
} from './build/runtime-origin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function azureRuntimeCspPlugin(runtimeOrigin) {
  return {
    name: 'phoenix-azure-runtime-csp',
    apply: 'build',
    async closeBundle() {
      const configPath = path.resolve(__dirname, 'dist', 'staticwebapp.config.json')
      const config = JSON.parse(await readFile(configPath, 'utf8'))
      const updated = injectConnectSource(config, runtimeOrigin)
      await writeFile(configPath, `${JSON.stringify(updated, null, 2)}\n`)
    }
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const runtime = command === 'build'
    ? requireProductionRuntime(env.VITE_API_BASE)
    : null

  return {
    plugins: [
      react(),
      ...(runtime ? [azureRuntimeCspPlugin(runtime.origin)] : [])
    ],
    define: runtime
      ? { 'import.meta.env.VITE_API_BASE': JSON.stringify(runtime.baseUrl) }
      : {},
    server: {
      port: 5173,
      open: true
    },
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      // Disable inline module preload polyfill to allow CSP script-src
      // without 'unsafe-inline'. Modern browsers support modulepreload natively.
      modulePreload: { polyfill: false }
    },
    root: __dirname
  }
})
