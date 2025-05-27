import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@views": path.resolve(__dirname, "src/views"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;`
      }
    }
  },
  base: "/",
  // base: "storyEditor",
  server: {
    host: true,
    port: 8080,
    watch: {
      usePolling: true,      // ✅ 加上這行
      interval: 100
    },
    proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  },
    
  },
  build: {
    rollupOptions: {
      external: ['axios'], // 告訴 Vite 不要打包 axios
    }
  }
});
