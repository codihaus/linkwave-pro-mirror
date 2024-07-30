import {readItems} from "@directus/sdk";
import { Logger } from '@directusLayer/utils/logger.util'
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'
import { ErrorReadItems } from '@directusLayer/utils/http.status'
export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const collection = getRouterParam(event, "collection");

    const query = getQuery(event)
    const apiUser = event.context.api_client;

    // const url = getRequestURL(event);
    // let urlDecode = decodeURIComponent(url.search.replace("?", ""));
    // const query = parse(urlDecode);

    if (query.filter && typeof query.filter === "string") {
        query.filter = JSON.parse(query.filter);
    }
    if (query.aggregate && typeof query.aggregate === "string") {
        query.aggregate = JSON.parse(query.aggregate);
    }

    return apiUser.request(readItems(collection as never, query)).catch((e: any) => {
        logger.error(`Error: readItems -> [${collection}]`)
        logger.debug({ query })
        return handleErrorsDirectus(e, ErrorReadItems)
    })
});

