import { Plugin } from "vite";
import { buildIndexData } from "./indexDataBuilder";
import { Options } from "./types/options";

export const DEFAULT_OPTIONS: Options = Object.freeze({
  transform: undefined, // No transformation
  searchComponentPath: "vitepress-plugin-simple-search/SimpleSearch.vue",
  searchOptions: {},
  previewLength: 64,
  loadingText: "Loading...",
  searchText: "Search...",
  placeholderText: "Search. Use double quotes for stricter results.",
  noResultsText: "No results found.",
  searchTimeText: "{time}ms for {count} results",
});

/**
 * Initialize the plugin, and pass additional configuration options.
 *
 * @export
 * @param {Partial<Options>} options
 * @return {Plugin}
 */
export function SimpleSearch(userOptions: Partial<Options> = {}): Plugin {
  const options = { ...DEFAULT_OPTIONS, ...userOptions } as Options;

  return {
    name: "simple-search",
    enforce: "pre",
    config: () => ({
      resolve: {
        alias: {
          "./VPNavBarSearch.vue": options.searchComponentPath,
        },
      },
    }),
    resolveId(id) {
      if (id === "virtual:simple-search") {
        return "\0virtual:simple-search";
      }
    },
    async load(this, id) {
      if (id === "\0virtual:simple-search") {
        const indexedData = await buildIndexData(options);

        return `export default ${JSON.stringify({
          ...options,
          indexedData,
        })};`;
      }
    },
  };
}
