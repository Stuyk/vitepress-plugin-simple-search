declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module 'virtual:simple-search' {
    const regexForContentStripping: RegExp;
    const data: Array<{ title: string; content: string; link: string }>;
    const searchText: string;
    const placeholderText: string;
    const noResultsText: string;
    const searchTimeText: string;
    export default {
        data,
        regexForContentStripping,
        searchText,
        placeholderText,
        noResultsText,
        searchTimeText,
    };
}
