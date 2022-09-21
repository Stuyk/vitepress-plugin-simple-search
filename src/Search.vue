<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';

type FileSearchData = Array<{ title: string; content: string; link: string }>;

const input = ref(); // Refs an input box.
const isSearchOpen = ref<boolean>(false);
const isSearchStrictMode = ref<boolean>(false);
const searchData = ref<string>('');
const fileData = ref<FileSearchData>([]);
const searchResults = ref<FileSearchData>([]);
const lastTimeoutID = ref<number | undefined>(undefined);
const msToSearch = ref<number>(0);
const regexForContentStripping = ref<RegExp>(/[\W_]+/g);

const debounce = (callback: Function, wait: number) => {
    if (typeof lastTimeoutID.value !== 'undefined') {
        window.clearTimeout(lastTimeoutID.value);
        lastTimeoutID.value = undefined;
    }

    lastTimeoutID.value = window.setTimeout(() => {
        callback();
    }, wait);
};

const trySearch = (event: any) => {
    debounce(() => {
        handleSearch(event);
    }, 250);
};

const containsSearchTerm = (terms: Array<string>, content: string) => {
    for (let term of terms) {
        if (term === '') {
            continue;
        }

        if (!content.includes(term)) {
            continue;
        }

        return true;
    }

    return false;
};

const handleSearch = (event: any) => {
    const startTime = Date.now();

    if (!event.target) {
        searchResults.value = fileData.value;
        msToSearch.value = Date.now() - startTime;
        isSearchStrictMode.value = false;
        return;
    }

    let searchTerm = event.target['value'];
    if (searchTerm.length <= 2) {
        searchResults.value = fileData.value;
        msToSearch.value = Date.now() - startTime;
        isSearchStrictMode.value = false;
        return;
    }

    isSearchStrictMode.value = searchTerm.charAt(0) === '"' && searchTerm.charAt(searchTerm.length - 1) === '"';
    searchTerm = searchTerm.toLowerCase().replace(regexForContentStripping.value, '');

    let searchTerms: Array<string>;
    if (isSearchStrictMode.value) {
        searchTerms = [searchTerm];
    } else {
        searchTerms = searchTerm.split(' ');
    }

    const filesToSearch = [...fileData.value];
    const newResults = filesToSearch.filter((file) => {
        if (file.title) {
            const doesInclude = containsSearchTerm(searchTerms, file.title.toLowerCase());
            if (doesInclude) {
                return true;
            }
        }

        if (file.content) {
            const doesInclude = containsSearchTerm(searchTerms, file.content.toLowerCase());
            if (doesInclude) {
                return true;
            }
        }

        if (file.link) {
            const doesInclude = containsSearchTerm(searchTerms, file.link.toLowerCase());
            if (doesInclude) {
                return true;
            }
        }

        return false;
    });

    // Adjust content of results to only include sliced portion...
    searchResults.value = newResults.map((data) => {
        const index = data.content.indexOf(searchTerm);
        return { ...data, content: '...' + data.content.slice(index, data.content.length) };
    });

    msToSearch.value = Date.now() - startTime;
};

const clearSearch = () => {
    searchResults.value = fileData.value;
    isSearchOpen.value = false;
    searchData.value = '';
};

const openSearch = () => {
    clearSearch();
    isSearchOpen.value = true;

    nextTick(() => {
        input.value.focus();
    });
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode !== 27) {
        return;
    }

    clearSearch();
};

onMounted(async () => {
    const importData = await import('virtual:simple-search');

    try {
        fileData.value = importData.default.data;
        searchResults.value = importData.default.data;
        regexForContentStripping.value = importData.default.regexForContentStripping;
    } catch (err) {
        console.log(`Could not load search data from virtual module.`);
        console.log(`Maybe search data includes malformed data?`);
        return;
    }

    console.log(`Vitepress Simple Search`);
    console.log(`Loaded: ${fileData.value.length} Files for Searching`);
});
</script>

<template>
    <div class="VPNavBarSearch">
        <!-- What is this? It moves content to the bottom of the body tag. -->
        <Teleport to="body">
            <div class="modal-container" v-if="isSearchOpen" @mousedown="clearSearch" @keyup="handleKeyDown">
                <div class="modal" @mousedown.stop>
                    <div class="input-box">
                        <input
                            @input="trySearch"
                            v-model="searchData"
                            class="search-input"
                            placeholder="Search. Use double quotes for stricter results."
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
                            :class="isSearchStrictMode ? { 'strict-mode': true } : {}"
                        />
                    </div>
                    <div class="search-results">
                        <div v-if="searchResults.length >= 1">
                            <div class="search-time">{{ msToSearch }}ms for {{ searchResults.length }} Results</div>
                            <a
                                class="result"
                                v-for="(result, index) in searchResults"
                                :key="index"
                                :href="result.link"
                                @click="clearSearch"
                            >
                                <div class="title">
                                    {{ result.title }}
                                </div>
                                <div class="content">
                                    {{ result.content.slice(0, 64) + '...' }}
                                </div>
                                <div class="link">
                                    {{ result.link }}
                                </div>
                            </a>
                        </div>
                        <div v-else>No Results</div>
                    </div>
                </div>
            </div>
        </Teleport>
        <div class="search">
            <div class="search-text" @click="openSearch()">Search...</div>
        </div>
    </div>
</template>

<style>
.search {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
}

.search-text {
    margin-left: 24px;
    font-family: 'Inter';
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    opacity: 0.75;
    letter-spacing: 0.2em;
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 6px;
    padding-bottom: 6px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-text:hover {
    background: rgba(255, 255, 255, 0.2);
}

.modal-container {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    min-width: 100vw;
    max-width: 100vw;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 99;
    justify-content: center;
    align-items: center;
}

.modal {
    position: absolute;
    top: 10vh;
    background: var(--vp-c-bg-soft);
    min-width: 600px;
    max-width: 600px;
    max-height: 500px;
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.15);
    padding: 12px;
    box-sizing: border-box;
}

.input-box {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    min-height: 35px;
    max-height: 35px;
    margin-bottom: 6px;
}

.input-box input {
    width: 100%;
    padding: 6px;
    font-size: 14px;
    font-family: 'Inter';
    padding-left: 12px;
    padding-right: 12px;
}

.search-time {
    font-size: 10px !important;
    padding-left: 4px;
}

.result {
    display: flex;
    flex-direction: column;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    border: 2px solid rgba(255, 255, 255, 0.05);
    margin-top: 6px;
}

.result .title {
    font-size: 16px;
    font-weight: 600;
}

.result .content {
    font-size: 12px;
}

.result .link {
    font-size: 10px;
}

.search-results {
    padding-right: 12px;
    min-height: calc(500px - 75px - 12px);
    max-height: calc(500px - 75px - 12px);
    overflow-y: auto;
}

.strict-mode {
    background: rgba(192, 255, 83, 0.2);
}
</style>
