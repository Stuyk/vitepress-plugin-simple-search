import { Plugin } from "vite";
import { buildDocumentation } from "./searchBuilder";

/**
 * Supply a base url if you are hosting on places like GitHub.
 * Should be something like `/your-repo-name`
 *
 * @export
 * @param {string} [baseURL='']
 * @return {Plugin}
 */
export function SimpleSearch(baseURL: string = ''): Plugin {
  let config: any;
  const virtualModuleId = "virtual:vitepress-plugin-simple-search";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vitepress-plugin-simple-search",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    config: () => ({
      resolve: {
        alias: { "./VPNavBarSearch.vue": "vitepress-plugin-search/Search.vue" },
      },
    }),

    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(this, id) {
      if (id !== resolvedVirtualModuleId) {
        return;
      }

      if (config.build.ssr) {
        return;
      }

      const fileData = await buildDocumentation(config.root, baseURL);

      // Construct Virtual Module for Search Vue
      return `
        const data = ${JSON.stringify(fileData)};
        export default data;
        `
    },
  };
}
