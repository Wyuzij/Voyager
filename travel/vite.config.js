import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// 新版 @dcloudio/uni-h5-vite 使用 Vite 5 的 server.hot，当前项目是 Vite 4
function vite4HotCompat() {
  return {
    name: 'vite4-hot-compat',
    enforce: 'pre',
    configureServer(server) {
      if (!server.hot) {
        server.hot = {
          send(payload) {
            server.ws.send(payload)
          }
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [vite4HotCompat(), uni()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        bypass(req) {
          const url = req.url || ''
          if (/\.(js|mjs|ts|vue|css|map)(\?|$)/.test(url)) {
            return url
          }
        },
        configure(proxy) {
          proxy.on('error', () => {})
        }
      },
      '/health': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('error', () => {})
        }
      }
    }
  }
})
