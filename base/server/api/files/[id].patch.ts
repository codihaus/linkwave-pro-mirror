import { Logger } from "../../utils/logger.util";
import { updateFile } from "@directus/sdk"

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    const id = getRouterParam(event, 'id')
    // const query = getQuery(event)
    const body = await readBody(event)
    // const cookies = parseCookies(event)

    const apiUser = event.context.api_client

    // logger.debug({ apiUser })

    // let data = await apiUser.request(redirectSSO())
    // logger.debug({ data })

    return apiUser.request(updateFile(id as string, body))
});


