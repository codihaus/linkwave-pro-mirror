import { get } from "lodash-es";
import {APIUserService} from "../../api-service";
import {readMe, registerUser, createUser} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const client = get(event.context, 'api_client');

    const body = await readBody(event)

    console.log('register payload:', body)

    const result = await client?.request(createUser({...body})).catch((error: any) => {
        throw createError({
            statusCode: 401,
            statusMessage: error?.errors?.[0].extensions.code ?? 'Failed',
        })
    })

    return result;
});
