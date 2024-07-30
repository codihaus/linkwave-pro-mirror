import { Logger } from '@directusLayer/utils/logger.util'
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'
import {refresh} from "@directus/sdk";
import {ErrorReadMeFailed} from "@directusLayer/utils/http.status";

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    // const provider = getRouterParam(event, 'provider')
    const query = getQuery(event)

    const refreshToken: any = query?.refresh_token ?? ''
    const apiUser = event.context.api_client

    const { access_token, expires, refresh_token } = await apiUser.request(refresh("json", refreshToken))
        .catch((e: any) => handleErrorsDirectus(e, ErrorReadMeFailed))

    logger.info({ access_token, expires, refresh_token })
    // logger.debug({ login, runtimeConfig })
    setCookie(event, COOKIE_TOKEN, access_token, {
        secure: true,
        maxAge: expires,
    });

    setCookie(event, COOKIE_REFRESH_TOKEN, refresh_token || "")

    const urlRedirect: any = query.fw ?? runtimeConfig.public.url

    return sendRedirect(event, urlRedirect, 302)
});


