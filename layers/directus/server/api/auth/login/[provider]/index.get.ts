import { ErrorProviderIncorrectSSO, ErrorLoginSSO } from '@directusLayer/utils/http.status'
import { Logger } from '@directusLayer/utils/logger.util'
import { Url } from '@directusLayer/utils/url.utils'
import {BACKEND_URL} from "@directusLayer/config";


export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const provider = getRouterParam(event, 'provider')
    let { fw }: any = getQuery(event)
    const { sso } = runtimeConfig

    if(!fw) {
        fw = runtimeConfig.public.url
    }

    if (!provider || !sso.providers.split(",").includes(provider)) {
        throw createError({
            ...ErrorProviderIncorrectSSO
        })
    }
    // AUTH_PROVIDERS
    // SSO_ALLOW_REDIRECT

    const urlCallback = encodeURIComponent(`${runtimeConfig.public.url}/api/auth/login/${provider}/callback?fw=${fw}`)

    const redirect = `${BACKEND_URL}/sso/login/callback?fw=${urlCallback}`

    // logger.debug({ apiUser })

    let url = new Url(`${BACKEND_URL}/auth/login/${provider}`)
    url.setQuery('redirect', redirect)

    logger.debug({ redirect, provider,url: url.toString() })

    return sendRedirect(event, url.toString(), 302)
})


