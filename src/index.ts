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
  const virtualModuleId = "virtual:simple-search";
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: "simple-search",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    config: () => ({
      resolve: {
        alias: { "./VPNavBarSearch.vue": "vitepress-plugin-simple-search/Search.vue" },
      },
    }),
    resolveId(id) {
      if (id === virtualModuleId) {
        console.log('-----------------------')
        console.log('found id...' + id);
        console.log(resolvedVirtualModuleId);
        return resolvedVirtualModuleId;
      }
    },
    async load(this, id) {
      if (id === resolvedVirtualModuleId) {
          const fileData = await buildDocumentation(config.root, baseURL);
          const javaScript: string =
            "const data =" +
            JSON.stringify(fileData) +
            ";\n" +
            "export default { data };"

          return javaScript;
      }
    },
  };
}
