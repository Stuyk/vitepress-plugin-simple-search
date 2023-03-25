import MiniSearch from "minisearch";
import { SimpleSearch } from "src/types/simpleSearch";
import { computed, ComputedRef, nextTick, onMounted, Ref, ref } from "vue";
import { IndexedData } from "../types/indexedData";

/**
 * Returns the search data from the virtual module.
 */
export async function getSimpleSearchData() {
  const importData = await import("virtual:simple-search");

  return importData.default;
}

export function useSimpleSearch(input: Ref<HTMLInputElement>): SimpleSearch {
  const simpleSearch = ref<MiniSearch>();
  const isOpen = ref<boolean>(false);
  const isLoading = ref<boolean>(true);

  const indexedData = ref<Map<string, IndexedData>>(new Map());
  const previewLength = ref<number>(64);
  const searchQuery = ref<string>("");
  const searchResults = ref<IndexedData[]>([]);
  const searchDuration = ref<number>(0);

  // translations
  const loadingText = ref("Loading...");
  const placeholderText = ref(
    "Search. Use double quotes for stricter results."
  );
  const searchText = ref("Search...");
  const noResultsText = ref("No results found.");
  const searchTimeText = ref("{time}ms for {count} results");

  /**
   * Returns the search time text with the time and count replaced.
   *
   * @returns {string}
   */
  const searchTime = computed(() => {
    return searchTimeText.value
      .replace("{time}", searchDuration.value.toString())
      .replace("{count}", searchResults.value.length.toString());
  });

  /**
   * Returns true if the search is in strict mode.
   * Strict mode is when the search term is wrapped in double quotes.
   * This is useful for searching for phrases.
   *
   * @returns {boolean}
   */
  const isStrictMode = computed(() => {
    return (
      searchQuery.value.length > 2 &&
      searchQuery.value.charAt(0) === '"' &&
      searchQuery.value.slice(-1) === '"'
    );
  });

  /**
   * Return query suggestions based on the search term.
   *
   * @return {string[]}
   */
  const searchSuggets: ComputedRef<string[]> = computed(() => {
    return (
      simpleSearch.value
        ?.autoSuggest(searchQuery.value)
        .sort((a, b) => b.score - a.score)
        .map((t) => t.suggestion) ?? []
    );
  });

  /**
   * Perform search query
   */
  function handleSearch() {
    const startTime = Date.now();
    let results: IndexedData[] = [];

    if (simpleSearch.value && searchQuery.value.length > 2) {
      results = simpleSearch.value
        .search(searchQuery.value, {
          combineWith: isStrictMode.value ? "AND" : undefined,
        })
        .sort((a, b) => b.score - a.score)
        .map((result) => {
          // result contains only id, get original data from it
          return indexedData.value.get(result.id) as IndexedData;
        });
    }

    searchDuration.value = Date.now() - startTime;
    searchResults.value = results;
  }

  const clearSearch = () => {
    isOpen.value = false;
    searchQuery.value = "";
  };

  const openSearch = () => {
    clearSearch();
    isOpen.value = true;

    nextTick(() => {
      input.value.focus();
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // force clear/close on 'Esc' pressed
    if (e.key === "Esc" && isOpen.value) {
      clearSearch();
    }
  };

  onMounted(async () => {
    const importData = await getSimpleSearchData();

    const searchData = importData.indexedData as IndexedData[];

    // improve performance by loading indexedData into a Map
    searchData.forEach((data: IndexedData) => {
      indexedData.value.set(data.id, data);
    });

    previewLength.value = importData.previewLength;
    searchText.value = importData.searchText;
    placeholderText.value = importData.placeholderText;
    noResultsText.value = importData.noResultsText;
    searchTimeText.value = importData.searchTimeText;

    try {
      simpleSearch.value = new MiniSearch<IndexedData[]>({
        fields: ["title", "text"],
        searchOptions: importData.searchOptions,
      });

      await simpleSearch.value.addAllAsync(searchData);
    } catch (error) {
      console.error(`Could not load search data from virtual module.`, {
        error,
      });
      console.warn(`Maybe search data includes malformed data?`);
      return;
    } finally {
      isLoading.value = false;
    }
    console.log(`Vitepress Simple Search`);
    console.log(`Loaded: ${indexedData.value.size} Files for Searching`);
  });

  return {
    // states
    isLoading,
    isOpen,
    isStrictMode,
    // search data
    searchQuery,
    searchResults,
    searchSuggets,
    previewLength,
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
  };
}
