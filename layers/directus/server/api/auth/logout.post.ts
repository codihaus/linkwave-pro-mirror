import {COOKIE_TOKEN, COOKIE_REFRESH_TOKEN} from "@directusLayer/utils/directus.token";
import { Logger } from '@directusLayer/utils/logger.util'
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    setCookie(
        event,
        COOKIE_TOKEN,
        "",
        {
            secure: true,
            maxAge: 0,
        });

    setResponseStatus(event, 201)
});
