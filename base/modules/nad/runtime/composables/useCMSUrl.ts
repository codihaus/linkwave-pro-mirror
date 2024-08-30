import {useRuntimeConfig} from "#app";
import {withoutTrailingSlash} from "ufo";

export const useCMSUrl = () => {
    const configRuntime = useRuntimeConfig()
    const baseUrl = withoutTrailingSlash(configRuntime?.app?.cms?.url ?? '/')

    function getCMSUrl(path: string = '') {
        return withoutTrailingSlash(`${baseUrl}/${path}`)
    }

    return {
        getCMSUrl
    }
}
