import { Logger } from '@directusLayer/utils/logger.util'
import { uploadFiles, customEndpoint } from "@directus/sdk"
import { handleErrorsDirectus } from '@directusLayer/utils/response.utils'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const logger = Logger(runtimeConfig.log_level)
    // const query = getQuery(event)
    const data: any = await readFormData(event)


    const apiUser = event.context.api_client

    // const formData = new FormData()
    // formData.append('file', body.file);

    // let data = await apiUser.request(redirectSSO())
    logger.debug({ data })

    try {

        return await apiUser.request(customEndpoint({
            method: 'POST',
            path: '/upload-chunk/upload',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: data
        }))
        
    } catch (error) {
        throw createError({
            status: 401,
            statusMessage: '',
            data: error
        })
    }

    // return apiUser.request(customEndpoint({
    //     method: 'POST',
    //     path: '/upload-chunk/upload',
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     },
    //     body: data
    // }))
});


