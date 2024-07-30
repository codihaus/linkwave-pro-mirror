import {useRuntimeConfig} from "#app";
import {withoutTrailingSlash} from "ufo";

export const useCMSUrl = (path: string = '') => {
    const configRuntime = useRuntimeConfig()
    const baseUrl = withoutTrailingSlash(configRuntime?.app?.cms?.url ?? '/')

    return withoutTrailingSlash(`${baseUrl}/${path}`)
}
