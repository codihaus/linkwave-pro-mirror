import { ErrorDeleteItem } from '@directusLayer/utils/http.status'
import { Logger } from '@directusLayer/utils/logger.util'
import { deleteItem } from "@directus/sdk"
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const id = getRouterParam(event, 'id')
    const collection = getRouterParam(event, 'collection')
    const query = getQuery(event)


    logger.debug({ id, collection })

    const apiUser = event.context.api_client

    // logger.debug({ apiUser })

    // let data = await apiUser.request(redirectSSO())
    // logger.debug({ data })


    return apiUser.request(deleteItem(collection as never, id as any)).catch((e: any) => {
        logger.error(`Error: deleteItem -> [${collection} : ${id}]`)
        logger.debug({ query })
        return handleErrorsDirectus(e, ErrorDeleteItem)

    })
});


