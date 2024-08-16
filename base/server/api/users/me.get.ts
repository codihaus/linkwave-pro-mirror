import {APIUserService} from "../../api-service";
import {readMe} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const client = event.context.api_client

    const result = await client.request(
        readMe({
            fields: ["*", 'current_plan.plan', 'email']
        })
    ).then((response) => {

        console.log('api users/me', response)
        return response
    }).catch((e: any) => {
        console.log(e.errors)
        return {};
    })

    return {
        status: 200,
        items: result
    };
});
