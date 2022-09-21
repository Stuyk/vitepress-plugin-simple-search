declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module 'virtual:simple-search' {
    const regexForContentStripping: RegExp;
    const data: Array<{ title: string; content: string; link: string }>;
    export default { data, regexForContentStripping };
}
