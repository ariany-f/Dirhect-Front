import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  include: [
    'react-dnd',
    'react-dnd-html5-backend'
  ],
  exclude: ['react-dnd-multi-backend'],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@imagens', replacement: path.resolve(__dirname, './public/imagens') },
      { find: '@assets', replacement: path.resolve(__dirname, './src/assets') },
      { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: '@contexts', replacement: path.resolve(__dirname, './src/contexts') },
      { find: '@components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@common', replacement: path.resolve(__dirname, './src/common') },
      { find: '@json', replacement: path.resolve(__dirname, './src/json') },
      { find: '@http', replacement: path.resolve(__dirname, './src/http') },
      { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
      { find: '@locales', replacement: path.resolve(__dirname, './src/locales') },
    ]
  }
})
