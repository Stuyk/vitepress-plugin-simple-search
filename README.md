![](https://i.imgur.com/j8tDCOZ.png)

# Vitepress Simple Search

Vitepress needs better offline search. Let's make it simple and quick.

## Credit

Thanks to everyone here in [this thread for offline search](https://github.com/vuejs/vitepress/issues/670) for getting the general idea implemented.

## Features

* Utilizes front-matter for page titles.
* Auto-strips content of extra tags.
* Auto-reads all markdown documents, and creates search data based on that.

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
import { SearchPlugin } from "vitepress-plugin-simple-search";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [SearchPlugin()],
});
```

## Additional Options

If you have a base url, append it inside of `SearchPlugin()`.

**Example**

```ts
SearchPlugin('/my-repo')
```
