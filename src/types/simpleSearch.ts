import { ComputedRef, Ref } from "vue";
import { IndexedData } from "./indexedData";

export type SimpleSearch = {
  // states
  isLoading: Ref<Boolean>;
  isOpen: Ref<Boolean>;
  isStrictMode: ComputedRef<Boolean>;
  // search data
  previewLength: Ref<number>;
  searchQuery: Ref<string>;
  searchSuggets: ComputedRef<string[]>;
  searchResults: Ref<IndexedData[]>;
  // translations
  loadingText: Ref<string>;
  placeholderText: Ref<string>;
  noResultsText: Ref<string>;
  searchText: Ref<string>;
  searchTime: Ref<string>;
  // methods
  clearSearch: () => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleSearch: () => void;
  openSearch: () => void;
};
