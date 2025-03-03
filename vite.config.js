import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
  }
})
