![](https://i.imgur.com/j8tDCOZ.png)

# Vitepress Simple Search

Vitepress needs better offline search. Let's make it simple and quick.

Thanks to everyone in [this thread for offline search](https://github.com/vuejs/vitepress/issues/670) for getting the general idea implemented.

## Features

- Utilizes front-matter for page titles.
- Auto-strips content of extra tags.
- Auto-reads all markdown documents, and creates search data based on that.
- Ability to customized indexed data with `transform` method.
- Ability to use quotes for stricter search results in-search.
- Ability to use your own search component with `useSimpleSearch` composable.
- Option to change translations.
- Markdown documents are resolved from `VITEPRESS_CONFIG.pages`.
- Use [MiniSearch](https://lucaong.github.io/minisearch/) as search engine.

## Installing

```js
npm i vitepress-plugin-simple-search
```

## Add the plugin

Create a file in `srcDir` called `vite.config.js` or `vite.config.ts`.

[See Vitepress docs for more info about srcDir](https://vitepress.dev/reference/site-config#srcdir).

```js
// [srcDir]/vite.config.js
import { SimpleSearch } from 'vitepress-plugin-simple-search';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [SimpleSearch()],
});
```

## Additional Options

These can be passed through the `SimpleSearch` function.

```ts
export type Options = {
  /**
   * Absolute path to search component.
   *
   * @default 'vitepress-plugin-simple-search/SimpleSearch.vue'
   * @type {string}
   * @memberof Options
   * @example 'absolute/path/to/MyCustomSearch.vue'
   */
  searchComponentPath?: string;

  /**
   * Search options to customize the search behavior.
   *
   * @type {SearchOptions}
   * @memberof Options
   */
  searchOptions?: SearchOptions;

  /**
   * Used to transform the generated data for each page.
   * This is useful if you want to add additional data to the search index.
   * By default search is scanning 'title' and 'text' field only.
   * You can add additional fields to the search index by using searchOptions.
   *
   * @type {(data: IndexedData) => IndexedData | Promise<IndexedData> | undefined}
   * @memberof Options
   */
  transform?: (data: IndexedData) => IndexedData | Promise<IndexedData>;
  
  /**
   * Maximum number of characters to display in the preview.
   * 
   * @default 64
   * @type {number}
   * @memberof Options
   */
  previewLength?: number;

  /**
   * Loading text on search component.
   *
   * @default 'Loading...'
   * @type string
   * @memberof Options
   */
  loadingText?: string;

  /**
   * Search text on navbar.
   *
   * @default 'Search...'
   * @type string
   * @memberof Options
   */
  searchText?: string;

  /**
   * Placeholder text on search input.
   *
   * @default 'Search. Use double quotes for stricter results.'
   * @type string
   * @memberof Options
   */
  placeholderText?: string;

  /**
   * Text to display when no results are found.
   *
   * @default 'No results found.'
   * @type string
   * @memberof Options
   */
  noResultsText?: string;

  /**
   * Text to display when search is complete.
   *
   * @default '{time}ms for {count} results'
   * @type string
   * @memberof Options
   */
  searchTimeText?: string;
};
```

### Example

```ts
// disable content stripping
SimpleSearch({ contentStripping: undefined });

// custom content stripping + custom texts
SimpleSearch({
  contentStripping: /<\/?[^>]+(>|$)/g,
  loadingText: 'Loading...',
  noResultsText: 'No results found.',
  placeholderText: 'Search. Use double quotes for stricter results.',
  searchText: 'Search',
  searchTimeText: '{time}ms for {count} results',
});
```

## Disable search for specific pages

You can disable search for specific pages by adding `searchable: false` to the front matter.

```md
---
title: 'My Cool Document'
searchable: false
---
# My Cool Document

Content, and everything else...
```

## Custom Search component

`vitepress-plugin-simple-search` exports `useSimpleSearch` composable with all search logic. You can use it in your own search component. You must pass `searchComponentPath` option to `SimpleSearch` function to override our default component.

```ts
export default defineConfig({
  plugins: [SimpleSearch({ 
    searchComponentPath: resolve(__dirname, '../path/to/MyCustomSearch.vue')
  })],
});
```

```ts
  <template>
    // your beautiful search component
  </template>

  <script setup>
    import { useSimpleSearch } from 'vitepress-plugin-simple-search/useSimpleSearch';

    const {
      // states
      isLoading,
      isOpen,
      isStrictMode,
      // search data
      previewLength,
      searchQuery,
      searchResults,
      searchSuggets,
      // translations
      loadingText,
      noResultsText,
      placeholderText,
      searchText,
      searchTime,
      // methods
      clearSearch,
      handleKeyDown,
      handleSearch,
      openSearch,
    } = useSimpleSearch();
  </script>
```

You should take a look at our `SimpleSearch.vue` component to see how it works.

## Limitations

- Ignore all content generated by Vue components.
- Does not create multiple search indexes for different languages.
- Does not split page content into sections with headings.