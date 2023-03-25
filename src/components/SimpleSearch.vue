<script lang="ts" setup>
import { ref } from "vue";
import "../assets/simpleSearch.css";
import { useSimpleSearch } from "../composables/useSimpleSearch";

const input = ref(); // Refs an input box.
const {
  // states
  isLoading,
  isOpen,
  isStrictMode,
  // search data
  searchQuery,
  searchSuggets,
  searchResults,
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
} = useSimpleSearch(input);
</script>

<template>
  <div id="SimpleSearch" class="VPNavBarSearch">
    <!-- Move content to the bottom of the body tag. -->
    <Teleport to="body">
      <div v-if="isLoading" v-html="loadingText"></div>
      <div
        class="modal-container"
        v-else-if="isOpen"
        @mousedown="clearSearch"
        @keyup="handleKeyDown"
      >
        <div class="modal" @mousedown.stop>
          <div class="input-box">
            <input
              v-model="searchQuery"
              class="search-input"
              :placeholder="placeholderText"
              aria-autocomplete="both"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              enterkeyhint="search"
              spellcheck="false"
              autofocus="true"
              maxlength="64"
              type="search"
              ref="input"
              list="search-suggestions"
              :class="isStrictMode ? { 'strict-mode': true } : {}"
              @input="handleSearch()"
            />

            <datalist id="search-suggestions">
              <option
                v-for="(suggestion, index) in searchSuggets"
                :value="suggestion"
                :key="index"
              />
            </datalist>
          </div>

          <div class="search-results">
            <div v-if="searchResults.length">
              <div class="search-time" v-html="searchTime"></div>
              <a
                class="result"
                v-for="(result, index) in searchResults"
                :key="index"
                :href="result.url"
                @click="clearSearch"
              >
                <div class="title">
                  {{ result.title }}
                </div>
                <div class="content" v-html="result.html.slice(0, previewLength) + '...'" />
                <div class="link">
                  {{ result.url }}
                </div>
              </a>
            </div>
            <div v-else v-html="noResultsText"></div>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="search">
      <div class="search-text" @click="openSearch()" v-html="searchText"></div>
    </div>
  </div>
</template>
