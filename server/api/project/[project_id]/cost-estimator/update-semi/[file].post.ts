import { Logger } from '@directusLayer/utils/logger.util'
import { uploadFiles, customEndpoint } from "@directus/sdk"
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    
    const project = getRouterParam(event, "project_id") as any
    const file = getRouterParam(event, "file") as any


    const apiUser = event.context.api_client

    try {

        return await apiUser.request(customEndpoint({
            method: 'POST',
            path: `/ai/update-semi/${project}/${file}`,
        }))
        
    } catch (error) {
        logger.debug({ error })

        throw createError({
            status: 401,
            statusMessage: 'Update semi auto error!',
            data: error
        })
    }
});


