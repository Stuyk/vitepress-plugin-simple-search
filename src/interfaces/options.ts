export interface Options {
    /**
     * Base URL to use for content link replacement.
     *
     * @type {string}
     * @memberof Options
     */
    baseURL?: string;

    /**
     * Used as a regex content remover for non-matching characters.
     * Setting this to undefined turns off all content stripping.
     * May have unintended side effects.
     *
     * @type {RegExp | undefined}
     * @memberof Options
     */
    regexForContentStripping?: RegExp | undefined;
}
