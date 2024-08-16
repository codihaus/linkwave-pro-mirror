import {ErrorReadMeFailed} from '@directusLayer/utils/http.status'
import {readMe} from "@directus/sdk"
import {handleErrorsDirectus} from '@directusLayer/utils/response.utils'
import { Logger } from '@directusLayer/utils/logger.util'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    console.log('query', query)
    const apiUser = event.context.api_client
    return await apiUser.request(readMe(query as never)).catch((e: any) => handleErrorsDirectus(e, ErrorReadMeFailed))
});
