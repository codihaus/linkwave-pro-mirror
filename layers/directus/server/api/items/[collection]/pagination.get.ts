import {aggregate} from "@directus/sdk";
import {get} from "lodash-es";

export default defineEventHandler(async (event) => {
    const api = event.context.api_client

    const query = {
        fields: ["*"],
        ...event.context.query_parsed,
    }

    const collection = getRouterParam(event, 'collection')

    console.log('aggregate', query)

    const [detail] = await api.request(
        aggregate(collection, {
                aggregate: {
                    countDistinct: "*"
                },
                query: {
                    search: query?.search,
                    filter: query?.filter ?? {}
                }
            }
        )).catch((error) => {
            console.log('error', error)
        })

        console.log('detail', detail)

    return {
        data: get(detail?.countDistinct, "*", 0),
        query
    }
})
