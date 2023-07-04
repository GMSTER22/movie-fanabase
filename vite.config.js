import { resolve } from "path";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        auth: resolve(__dirname, "src/auth/index.html"),
        genre: resolve(__dirname, "src/genre/index.html"),
      },
    },
  },

  plugins: [basicSsl()],
});
