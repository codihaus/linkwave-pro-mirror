import { readFields } from "@directus/sdk"
import { ErrorReadAllFields } from "@directusLayer/utils/http.status"
import { Logger } from '@directusLayer/utils/logger.util'
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const apiUser = event.context.api_client


    return apiUser.request(readFields()).catch((e: any) => {
        logger.error(`Error: readAllFields`)
        return handleErrorsDirectus(e, ErrorReadAllFields)
    })
});

