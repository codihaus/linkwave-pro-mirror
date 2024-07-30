import { ErrorCreateItem } from '@directusLayer/utils/http.status'
import { createItem } from "@directus/sdk"
import { Logger } from '@directusLayer/utils/logger.util'
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const query: any = getQuery(event)
    const collection = getRouterParam(event, "collection")
    const body = await readBody(event)

    const apiUser = event.context.api_client

    return await apiUser.request(createItem(collection as never, body as never, query))
        .catch((e: any) => {
            logger.error(`Error: createItem -> [${collection}]`)
            logger.debug({ query })
            return handleErrorsDirectus(e, ErrorCreateItem)
        })
})
