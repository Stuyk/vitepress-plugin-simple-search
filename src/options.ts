import { Options } from './interfaces/options';

let options: Options = {
    baseURL: '',
    regexForContentStripping: /[^a-zA-Z0-9._ ]+/g,
    preambleTransformer: undefined, // No transformation
};

/**
 * Used to set default options for indexing data.
 *
 * @export
 * @param {Options} userOptions
 * @return {Options}
 */
export function setOptions(userOptions: Options): Options {
    options = { ...options, ...userOptions };

    if (options && options.baseURL) {
        if (options.baseURL.length >= 1 && options.baseURL.charAt(options.baseURL.length - 1) === '/') {
            options.baseURL = options.baseURL.slice(0, options.baseURL.length - 1);
        }
    }

    if (!options.partialsToIgnore) {
        options.partialsToIgnore = [];
    }

    return options;
}

/**
 * Return the current options.
 *
 * @export
 * @return {Options}
 */
export function getOptions(): Options {
    return options;
}
