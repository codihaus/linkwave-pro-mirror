import { readField } from "@directus/sdk"
import { ErrorReadField } from "@directusLayer/utils/http.status"
import { Logger } from '@directusLayer/utils/logger.util'
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const collection = getRouterParam(event, 'collection')
    const field = getRouterParam(event, 'field')

    const apiUser = event.context.api_client


    return apiUser.request(readField(collection as string, field as string)).catch((e: any) => {
        logger.error(`Error: readField`)
        return handleErrorsDirectus(e, ErrorReadField)
    })
});

