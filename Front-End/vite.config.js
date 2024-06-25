import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteFaviconsPlugin } from "vite-plugin-favicon";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), 
      ViteFaviconsPlugin({
      logo: "src/icon.svg",
    }),
  ],

  server:{
    port: 5000,
  proxy: {
    "/api":{
      target: "http://localhost:3000",
      changeOrigin: true,
      secure: true,
    }
  }
  }
})
