import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Removing dotenv dependency
export default defineConfig(({ mode }) => {
  // Load env vars using Vite's built-in method
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }

  return {
    plugins: [react()],
    server: {
      host: 'localhost',
      port: 3000, // ou outra porta desejada
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '@assets', replacement: path.resolve(__dirname, './src/assets') },
        { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
        { find: '@contexts', replacement: path.resolve(__dirname, './src/contexts') },
        { find: '@components', replacement: path.resolve(__dirname, './src/components') },
        { find: '@common', replacement: path.resolve(__dirname, './src/common') },
        { find: '@json', replacement: path.resolve(__dirname, './src/json') },
        { find: '@http', replacement: path.resolve(__dirname, './src/http') },
        { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
      ]
    },
    define: {
      'import.meta.env.VITE_GENERAL_DOMAIN': JSON.stringify('ativary.localhost')
    }
  }
})
