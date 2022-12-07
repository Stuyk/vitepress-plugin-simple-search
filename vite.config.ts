const path = require("path");
const { defineConfig } = require("vite");
import { viteStaticCopy } from "vite-plugin-static-copy";

module.exports = defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/Search.vue",
          dest: "./",
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SearchPlugin",
      fileName: (format: string) => `simple-search.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "glob", "gray-matter", "fs-extra"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          'fs-extra': 'fs-extra',
        },
      },
    },
  },
});
