import {useRuntimeConfig} from "#app";
import {withoutTrailingSlash} from "ufo";

export const useNADUrl = () => {
    const configRuntime = useRuntimeConfig()
    const baseUrl = withoutTrailingSlash(configRuntime.public?.url ?? '/')

    return {
        url: withoutTrailingSlash(`${baseUrl}/api`)
    }
}
