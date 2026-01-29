import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Checker from 'vite-plugin-checker'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import importToCDN, { autoComplete } from 'vite-plugin-cdn-import'
import { visualizer } from 'rollup-plugin-visualizer'
type Drop = 'console' | 'debugger'

// !如果使用Cdn打包的话 unplugin-auto-import 和 unplugin-vue-components  会失效需要 手动引入
const plugins = [
  vue(),
  Checker({
    vueTsc: {
      tsconfigPath: './tsconfig.app.json',
    },
  }),
  // AutoImport({
  //   imports: ['vue','vue-router','pinia'],
  //   dts: './src/types/auto-imports.d.ts',
  // }),
  // Components({
  //   dts: './src/types/components.d.ts',
  //   dirs: ['./src/components'],
  //   resolvers: [NaiveUiResolver()],
  // }),
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(__dirname, 'src/assets/icons')],
    // 指定symbolId格式
    symbolId: 'icon-[name]',
  }),
  importToCDN({
    modules: [
      autoComplete('vue'),
      autoComplete('vue-router'),
      {
        name: 'echarts',
        var: 'echarts',
        path: 'https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.min.js',
      },
      {
        name: 'axios',
        var: 'axios',
        path: 'https://cdn.jsdelivr.net/npm/axios@1.8.4/dist/axios.min.js',
      },
      {
        name: 'naive-ui',
        var: 'naive',
        path: 'https://cdn.jsdelivr.net/npm/naive-ui@2.41.0/dist/index.prod.js',
      },
      {
        name: 'pinia',
        var: 'Pinia',
        path: 'https://cdn.jsdelivr.net/npm/pinia@3.0.2/dist/pinia.iife.prod.js',
      },
    ],
  }),
  visualizer({
    open: true, // 打包完成后自动打开浏览器
    // gzipSize: true,
    // brotliSize: true,
    filename: 'dist/stats.html', // 分析图生成的路径
  }),
]
const resolve = {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
  extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
}
const build = {
  rollupOptions: {
    external: ['@vue', 'birpc', 'hookable', 'perfect-debounce'],
    output: {
      // 最小化拆分包
      manualChunks(id: string) {
        if (id.includes('node_modules')) {
          return id.toString().split('node_modules/')[1].split('/')[0].toString()
        }
      },
      chunkFileNames: (chunkInfo: any) => {
        const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : []
        const fileName1 = facadeModuleId[facadeModuleId.length - 2] || '[name]'
        return `js/${fileName1}/[name].[hash].js`
      },
      entryFileNames: 'js/[name].[hash].js',
      assetFileNames: '[ext]/[name].[hash:4].[ext]',
    },
  },
}

export default defineConfig(({ mode, command }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, __dirname)
  const server = {
    // 选择本地ip
    host: '0.0.0.0',
    port: parseInt(env.VITE_APP_START_PORT),
    proxy: {
      [env.VITE_APP_PREFIX]: {
        target: env.VITE_APP_URL,
        changeOrigin: true,
        rewrite: (p: string) => p.replace(new RegExp('^' + env.VITE_APP_PREFIX), ''),
      },
    },
  }
  const esbuild = {
    drop: (command === 'build' ? ['console', 'debugger'] : []) as Drop[],
  }
  return {
    base: './',
    plugins,
    resolve,
    server,
    build,
    esbuild,
  }
})
