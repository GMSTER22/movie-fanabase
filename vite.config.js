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
        login: resolve(__dirname, "src/login/index.html"),
        logout: resolve(__dirname, "src/logout/index.html"),
        "account-movies": resolve(__dirname, "src/account-movies/index.html"),
        genre: resolve(__dirname, "src/genre/index.html"),
        details: resolve(__dirname, "src/movie-details/index.html"),
        categories: resolve(__dirname, "src/categories/index.html"),
      },
    },
  },

  plugins: [basicSsl()],
});
