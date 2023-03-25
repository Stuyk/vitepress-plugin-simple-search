import { resolve } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import dts from "vite-plugin-dts";

/**
 * Hack to flatten d.ts files to dist/types
 *
 * @example /dist/types/src/types/searchData.d.ts -> /dist/types/searchData.d.ts
 * @param {string} filepath
 * @returns {string}
 */
function flattenDeclarationTypes(filepath: string): string {
  const regex = /\/dist\/types\/(?:\w+\/)*(.*?)\.d\.ts/g;
  return filepath.replace(regex, "/dist/types/$1.d.ts");
}

/**
 * Hack to fix import paths in d.ts files
 *
 * @example import { SearchData } from './types/searchData'; -> import { SearchData } from './searchData';
 * @param {string} content
 * @returns {string}
 */
function fixImportDeclarationTypes(content: string): string {
  const regex = /(\.\/\w+\/)(.*\/)?(\w+)/g;
  return content.replace(regex, "./$3");
}

module.exports = defineConfig({
  plugins: [
    dts({
      outputDir: "dist/types",
      // write all declaration files to dist/types
      beforeWriteFile(filePath, content) {
        return {
          filePath: flattenDeclarationTypes(filePath),
          content: fixImportDeclarationTypes(content),
        };
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/components/SimpleSearch.vue",
          dest: "./components",
        },
        {
          src: "src/composables/useSimpleSearch.ts",
          dest: "./composables",
        },
        {
          src: "src/assets/simpleSearch.css",
          dest: "./assets",
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SearchPlugin",
      fileName: (format: string, name: string) => `simple-search.${format}.js`,
    },
    rollupOptions: {
      plugins: [],
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "vue",
        "gray-matter",
        "fs-extra",
        "minisearch",
        "virtual:simple-search",
        "uuid",
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          "gray-matter": "gray-matter",
          "fs-extra": "fs-extra",
          "uuid": "uuid",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      all: true,
      include: ["src/**/*.ts"],
      exclude: ["src/__tests__/*.ts", "src/types/*.ts", "src/index.ts"],
    },
  },
});
