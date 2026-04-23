import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages (https://hikavn.github.io/Chord_Trainer/) 用
  // 開発時はルート配信、本番ビルド時のみリポジトリ名のサブパスを使う
  base: command === 'build' ? '/Chord_Trainer/' : '/',
}))
