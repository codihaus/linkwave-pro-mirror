import { ErrorDeleteItem } from '@directusLayer/utils/http.status'
import { Logger } from '@directusLayer/utils/logger.util'
import { deleteItem, deleteItems, readMe } from "@directus/sdk"
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

    let keys = body?.keys ? body?.keys : [id]

    logger.debug({ keys })

    return apiUser.request(deleteItems(collection as never, keys)).catch(async(e: any) => {
        logger.error(`Error: deleteItem -> [${collection} : ${id}, ${keys}]`)
        logger.debug({ query })
        await apiUser.request(readMe()).then((response) => {
            logger.debug(response)
        })
        return handleErrorsDirectus(e, ErrorDeleteItem)

    })
});


