import { Plugin } from 'vite';
import { Options } from './interfaces/options';
import { setOptions } from './options';
import { buildDocumentation } from './searchBuilder';
import fs from 'fs';

/**
 * Initialize the plugin, and pass additional configuration options.
 *
 * @export
 * @param {Options} options
 * @return {Plugin}
 */
export function SimpleSearch(userOptions: Options): Plugin {
    const options = setOptions(userOptions);

    let config: any;
    const virtualModuleId = 'virtual:simple-search';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    return {
        name: 'simple-search',
        enforce: 'pre',
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        config: () => ({
            resolve: {
                alias: { './VPNavBarSearch.vue': 'vitepress-plugin-simple-search/Search.vue' },
            },
        }),
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        async load(this, id) {
            if (id === resolvedVirtualModuleId) {
                const filePathway = options.docsPath ? options.docsPath : config.root;
                if (!fs.existsSync(filePathway)) {
                    console.warn(`File Pathway: ${filePathway} does not exist. Search could not be built.`)
                    console.warn(`Try 'process.cwd() + your folder'`)
                    throw new Error(`Docs pathway could not be found.`);
                }

                const fileData = await buildDocumentation(config.root);
                const javaScript: string =
                    `const regexForContentStripping = ${options.regexForContentStripping}` +
                    ';\n' +
                    'const data =' +
                    JSON.stringify(fileData) +
                    ';\n' +
                    'export default { data, regexForContentStripping };';

                return javaScript;
            }
        },
    };
}
