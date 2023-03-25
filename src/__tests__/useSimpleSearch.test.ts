import { render, waitFor } from "@testing-library/vue";
import { SimpleSearch } from "src/types/simpleSearch";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { ref } from "vue";
import { useSimpleSearch } from "../composables/useSimpleSearch";
import { DEFAULT_OPTIONS } from "../index";
import { withSetup } from "./utils";

vi.mock("virtual:simple-search", () => {
  return {
    default: {
      ...DEFAULT_OPTIONS,
      indexedData: [
        {
          id: "id-foo",
          title: "foo",
          text: "this is a test with foo",
        },
        {
          id: "id-bar",
          title: "bar",
          text: "this is a special test with bar and baz",
        },
        {
          id: "id-baz",
          title: "baz",
          text: "this is a test with only baz",
        },
      ],
    },
  };
});

describe("Test useSimpleSearch", async () => {
  let sp: SimpleSearch;

  beforeAll(async () => {
    const rendered = render({
      template: `<input value="" data-testid="search-query" type="text" />`,
    });
    const input = ref(rendered.getByTestId("search-query") as HTMLInputElement);

    const { result } = withSetup(() => useSimpleSearch(input)) as unknown as {
      result: SimpleSearch;
    };

    // await until loading is done
    await waitFor(() => {
      if (result.isLoading.value === true) {
        throw new Error("still loading");
      }
    });

    sp = result;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("initial values should be valid", async () => {
    expect(sp.isLoading.value).toBe(false);
    expect(sp.isOpen.value).toBe(false);
    expect(sp.isStrictMode.value).toBe(false);
    expect(sp.searchQuery.value).toBe("");
    expect(sp.searchSuggets.value).toEqual([]);
    expect(sp.searchResults.value).toEqual([]);
    expect(sp.placeholderText.value).toBe(DEFAULT_OPTIONS.placeholderText);
    expect(sp.searchText.value).toBe(DEFAULT_OPTIONS.searchText);
    expect(sp.noResultsText.value).toBe(DEFAULT_OPTIONS.noResultsText);
  });

  test("isOpen should be true", async () => {
    sp.openSearch();
    expect(sp.isOpen.value).toBe(true);
  });

  test('searchSuggests should provide "bar" and "baz"', async () => {
    sp.searchQuery.value = "ba";
    expect(sp.searchSuggets.value.length).toBe(2);
  });

  test('searchResults should have 1 matching result with searching "foo"', async () => {
    sp.searchQuery.value = "foo";
    sp.handleSearch();
    expect(sp.searchSuggets.value.length).toBe(1);
    expect(sp.searchResults.value.length).toBe(1);
  });

  test('searchResults should have 1 matching result with searching "special bar"', async () => {
    sp.searchQuery.value = "special bar";
    sp.handleSearch();
    expect(sp.searchResults.value.length).toBe(1);
  });

  test('searchResults should have 1 matching result with strict searching "and baz"', async () => {
    sp.searchQuery.value = '"and baz"';
    sp.handleSearch();
    expect(sp.isStrictMode.value).toBe(true);
    expect(sp.searchSuggets.value.length).toBe(1);
    expect(sp.searchResults.value.length).toBe(1);
  });

  test('searchResults should have 3 matching result with searching "test"', async () => {
    sp.searchQuery.value = "test";
    sp.handleSearch();
    expect(sp.searchResults.value.length).toBe(3);
  });

  test('searchResults should have 0 matching result with searching "unknown"', async () => {
    sp.searchQuery.value = "unknown";
    sp.handleSearch();
    expect(sp.searchResults.value.length).toBe(0);
  });

  test("isOpen should be falsy and searchQuery empty", async () => {
    sp.clearSearch();
    expect(sp.isOpen.value).toBe(false);
    expect(sp.searchQuery.value).toBe("");
    expect(sp.searchResults.value.length).toBe(0);
  });

  test("isOpen should be false on press Esc", async () => {
    sp.openSearch();
    expect(sp.isOpen.value).toBe(true);

    sp.handleKeyDown({ key: "Esc" } as KeyboardEvent);
    expect(sp.isOpen.value).toBe(false);
  });
});
