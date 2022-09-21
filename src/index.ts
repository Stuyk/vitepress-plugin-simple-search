import { Plugin } from 'vite';
import { Options } from './interfaces/options';
import { setOptions } from './options';
import { buildDocumentation } from './searchBuilder';

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
