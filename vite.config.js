import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     input: [resolve(__dirname, "./src/user/index.html")],
  //     output: [resolve(__dirname, "./dist")],
  //   },
  // },
  resolve: {
    alias: {
      "@lib": resolve(__dirname, "./src/user/lib"),
    },
  },
});
