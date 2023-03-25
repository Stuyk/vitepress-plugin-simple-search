import { SearchOptions } from "minisearch";
import { IndexedData } from "./indexedData";

export type Options = {
  /**
   * Absolute path to search component.
   *
   * @default 'vitepress-plugin-simple-search/SimpleSearch.vue'
   * @type {string}
   * @memberof Options
   * @example 'absolute/path/to/MyCustomSearch.vue'
   */
  searchComponentPath: string;

  /**
   * Search options to customize the search behavior.
   *
   * @type {SearchOptions}
   * @memberof Options
   */
  searchOptions: SearchOptions;

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
  previewLength: number;

  /**
   * Loading text on search component.
   *
   * @default 'Loading...'
   * @type string
   * @memberof Options
   */
  loadingText: string;

  /**
   * Search text on navbar.
   *
   * @default 'Search...'
   * @type string
   * @memberof Options
   */
  searchText: string;

  /**
   * Placeholder text on search input.
   *
   * @default 'Search. Use double quotes for stricter results.'
   * @type string
   * @memberof Options
   */
  placeholderText: string;

  /**
   * Text to display when no results are found.
   *
   * @default 'No results found.'
   * @type string
   * @memberof Options
   */
  noResultsText: string;

  /**
   * Text to display when search is complete.
   *
   * @default '{time}ms for {count} results'
   * @type string
   * @memberof Options
   */
  searchTimeText: string;
};
