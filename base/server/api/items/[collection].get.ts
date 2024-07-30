import { readItems } from "@directus/sdk";
import {get} from "lodash-es";
import { parse } from "qs";

export default defineEventHandler(async (event) => {
    // const query = getQuery(event);
    const collection: never = getRouterParam(event, "collection") as any;
    const client = get(event.context, 'api_client');

    const url = getRequestURL(event);
    let urlDecode = decodeURIComponent(url.search.replace("?", ""));
    const query = parse(urlDecode);

    if (query.filter && typeof query.filter === "string") {
        query.filter = JSON.parse(query.filter);
    }
    if (query.aggregate && typeof query.aggregate === "string") {
        query.aggregate = JSON.parse(query.aggregate);
    }

    const items = await client
        .request(
            readItems(collection, {
                limit: 10,
                ...query
            } as any)
        )
        .catch((e: any) => {
            console.log(e)
            return [];
        });

    return {
        status: 200,
        items: items,
        collection: collection,
        query
    };
});
