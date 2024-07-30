import { get } from "lodash-es";
import {APIUserService} from "../../api-service";
import {readMe, registerUser, createUser} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const client = get(event.context, 'api_client');

    const body = await readBody(event)

    console.log('register payload:', body)

    const result = await client?.request(createUser({...body})).catch((e: any) => {
        throw createError({
            statusCode: 401,
            statusMessage: 'Failed!',
        })
    })

    return result;
});
