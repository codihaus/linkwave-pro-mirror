import { Logger } from "../../utils/logger.util";
import { uploadFiles } from "@directus/sdk"

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    // const query = getQuery(event)
    const data: any = await readFormData(event)
    // const cookies = parseCookies(event)

    const apiUser = event.context.api_client

    // const formData = new FormData()
    // formData.append('file', body.file);

    // let data = await apiUser.request(redirectSSO())
    // logger.debug({ data })

    return apiUser.request(uploadFiles(data))
});


