import { preview } from 'vite';
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "virtual:simple-search" {
  import { IndexedData } from "./src/types/indexedData";
  import { SearchOptions } from "minisearch";

  const indexedData: { [id: string]: IndexedData };
  const searchOptions: SearchOptions;
  const previewLength: number;
  const loadingText: string;
  const noResultsText: string;
  const placeholderText: string;
  const searchText: string;
  const searchTimeText: string;
  export default {
    indexedData,
    searchOptions,
    previewLength,
    loadingText,
    noResultsText,
    placeholderText,
    searchText,
    searchTimeText,
  };
}
