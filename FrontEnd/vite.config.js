// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//    server: {
//       proxy: {
//          // "/api": "http://localhost:3000",
//          "/api": "https://esport-x.vercel.app/",
//       },
//    },
//    logLevel: "info", // Add this line
//    plugins: [react(), tailwindcss()],
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
   server: {
      proxy: {
         "/api": {
            target: "https://esport-x.vercel.app",
            changeOrigin: true,
            secure: true,
            rewrite: (path) => path.replace(/^\/api/, "/api"),
         },
      },
   },
   logLevel: "info",
   plugins: [react(), tailwindcss()],
});
