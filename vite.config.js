// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";

import postcssImport from "postcss-import"
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'utils': path.resolve(__dirname, './src/utils'),
      'components': path.resolve(__dirname, './src/components'),
      'directive': path.resolve(__dirname, './src/utils/directive'),
      'assets': path.resolve(__dirname, './src/assets')
    },
  },
  css: {
    postcss:{
      plugins:[
        postcssImport,
        tailwindcss
      ]
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

//     // 生产环境下，去除console和debugger，webpack的话需要编写pluign来去除
//     build:{
//       terserOptions: {
//           compress: {
//             drop_console: true,
//             drop_debugger: true
//           }
//       }
//     }
