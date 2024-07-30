import { ErrorUpdateItem } from '@directusLayer/utils/http.status'
import { Logger } from '@directusLayer/utils/logger.util'
import { updateItem } from "@directus/sdk"
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const id = getRouterParam(event, 'id')
    const collection = getRouterParam(event, 'collection')
    const query = getQuery(event)
    const body = await readBody(event)


    logger.debug({ id, collection })

    const apiUser = event.context.api_client

    // logger.debug({ apiUser })

    // let data = await apiUser.request(redirectSSO())
    // logger.debug({ data })


    return apiUser.request(updateItem(collection as never, id as any, body as never, query as any)).catch((e: any) => {
        logger.error(`Error: updateItem -> [${collection} : ${id}]`)
        logger.debug({ query })
        return handleErrorsDirectus(e, ErrorUpdateItem)

    })
});


