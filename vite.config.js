import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_BASE_URL } = loadEnv(mode, process.cwd())
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8005,
      open: true,
      cors: true,
      hmr: true,
      proxy: {
        [VITE_BASE_URL]: {
          // target: 'http://192.168.10.74:9999',
          target: 'https://operation-test.dongancloud.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    plugins: [
      vue(),
      vueSetupExtend(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      })
    ]
  }
})
