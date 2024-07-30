import {ErrorReadMeFailed} from '@directusLayer/utils/http.status'
import {readMe} from "@directus/sdk"
import {handleErrorsDirectus} from '@directusLayer/utils/response.utils'
import { Logger } from '@directusLayer/utils/logger.util'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const apiUser = event.context.api_client
    return apiUser.request(readMe(query as never)).catch((e: any) => handleErrorsDirectus(e, ErrorReadMeFailed))
});
