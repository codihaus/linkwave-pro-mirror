import { ErrorUserAcceptInvited } from '@directusLayer/utils/http.status'
import { Logger } from '@directusLayer/utils/logger.util'
import { acceptUserInvite } from "@directus/sdk"
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)

    const { token, password } = await readBody(event)

    // logger.debug({ body })

    const apiUser = event.context.api_client

    return apiUser.request(acceptUserInvite(token, password))
        .catch((e: any) => handleErrorsDirectus(e, ErrorUserAcceptInvited))
});


