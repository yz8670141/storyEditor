import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  base: "/storyEditor/",
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
  // server: {
  //   host: true,
  //   port: 5173,
  //   watch: {
  //     usePolling: true, 
  //     interval: 100
  //   },
    
  // },
  
});
