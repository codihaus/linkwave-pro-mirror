
interface ImportMeta {
    url: string;
    readonly hot?: import("./hot").ViteHotContext;
    readonly env: ImportMetaEnv;
    glob: import("./importGlob").ImportGlobFunction;
}

interface H3Event {
    context: {
        api_client: any
    }
}
