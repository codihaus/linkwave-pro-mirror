import { Logger } from '@directusLayer/utils/logger.util'
import { readAssetBlob } from "@directus/sdk"

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const id = getRouterParam(event, 'id')
    const query = getQuery(event)


    const apiUser = event.context.api_client

    // logger.debug({ apiUser })

    return apiUser.request(readAssetBlob(id as string, query))

})


