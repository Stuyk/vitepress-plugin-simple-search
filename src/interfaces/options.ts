export interface Options {
    /**
     * Base URL to use for content link replacement.
     *
     * @type {string}
     * @memberof Options
     */
    baseURL?: string;

    /**
     * Pathway to docs folder.
     * Must be an ABSOLUTE path. Not relative.
     *
     * @type {string}
     * @memberof Options
     */
    docsPath?: string;

    /**
     * A list of strings of partial file names or folders to ignore and not add to search.
     *
     * @type {Array<string>}
     * @memberof Options
     */
    partialsToIgnore?: Array<string>;

    /**
     * Used as a regex content remover for non-matching characters.
     * Setting this to undefined turns off all content stripping.
     * May have unintended side effects.
     *
     * @type {RegExp | undefined}
     * @memberof Options
     */
    regexForContentStripping?: RegExp | undefined;

    /**
     * Used to transform the front matter.
     *
     * @type {any => any | undefined}
     * @memberof Options
     */
    preambleTransformer?: ((data: { [key: string]: any }) => { [key: string]: any }) | undefined;
}
