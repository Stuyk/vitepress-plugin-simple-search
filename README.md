# Hey Listen!

This repository is no longer necessary. Vitepress has offline search built in as of `alpha 65`.

---

---

---

# Vitepress Simple Search

Vitepress needs better offline search. Let's make it simple and quick.

Thanks to everyone in [this thread for offline search](https://github.com/vuejs/vitepress/issues/670) for getting the general idea implemented.

## Features

* Utilizes front-matter for page titles.
* Auto-strips content of extra tags.
* Auto-reads all markdown documents, and creates search data based on that.
* Ability to change baseURL for doc pathing.
* Ability to change regexp for content stripping and searching content.
* Ability to use quotes for stricter search results in-search.
* Option to change docs path.
* Option to ignore specific files or folders based on partial naming.

## Required

Make sure all of your markdown documents have `title` in their front matter.

Example:

```md
---
title: 'My Cool Document'
---

# {{ $frontmatter.title }}

Content, and everything else...
```

## Installing

```js
npm i vitepress-plugin-simple-search
```

## Add the plugin

Create a file in `docs` called `vite.config.js` or `vite.config.ts`.

```js
// docs/vite.config.js
import { SimpleSearch } from "vitepress-plugin-simple-search";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [SimpleSearch()],
});
```

## Additional Options

These can be passed through the `SimpleSearch` function.

```ts
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
     * Must be an absolute path.
     * Defaults to 'docs' folder.
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
}
```

**Example**

```ts
SimpleSearch({ baseURL: '/my-repo', regexForContentStripping: undefined });
```
