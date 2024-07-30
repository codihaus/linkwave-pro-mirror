import { readFieldsByCollection } from "@directus/sdk"
import { ErrorReadFieldsCollection } from "@directusLayer/utils/http.status"
import { Logger } from '@directusLayer/utils/logger.util'
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const collection = getRouterParam(event, 'collection')

    const apiUser = event.context.api_client


    return apiUser.request(readFieldsByCollection(collection as string)).catch((e: any) => {
        logger.error(`Error: readFieldsByCollection`)
        return handleErrorsDirectus(e, ErrorReadFieldsCollection)
    })
});

