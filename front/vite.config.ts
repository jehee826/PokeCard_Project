import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ip from './default.ts';

export default defineConfig({
  plugins: [react()],
    server: {
      allowedHosts: [
      'thrower-unnerve-tux.ngrok-free.dev' // 에러 메시지에 뜬 주소를 여기에 추가
    ],
    proxy: {
      '/api': {
        target: `http://${ip}:8080`,
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: '../back/src/main/resources/static',
    emptyOutDir: true,
  },
    optimizeDeps: {
    exclude: ['onnxruntime-web']
  },
})
