import { Logger } from '@directusLayer/utils/logger.util'
import { uploadFiles, customEndpoint } from "@directus/sdk"
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const body = await readBody(event);


    const apiUser = event.context.api_client

    try {

        return await apiUser.request(customEndpoint({
            method: 'POST',
            path: `/ai/${body?.analyze_id}/start`,
        }))
        
    } catch (error) {
        logger.debug({ error })

        throw createError({
            status: 401,
            statusMessage: 'Analyzing file error!',
            data: error
        })
    }
});


