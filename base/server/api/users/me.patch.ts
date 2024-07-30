import {APIUserService} from "../../api-service";
import {readMe, updateMe} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const client = event.context.api_client
    const body = await readBody(event)

    const result = await client.request(
        updateMe(body)
    ).then((response) => {
        return response
    }).catch((e: any) => {
        throw createError({
            statusCode: 401,
            statusMessage: 'Failed!',
        })
    })

    return {
        status: 200,
        items: result
    };
});
