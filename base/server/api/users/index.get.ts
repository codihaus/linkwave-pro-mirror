import {getQuery} from "ufo";
import {readMe, readUsers} from "@directus/sdk";
import {parse} from "qs"
import {SuccessResponseStatus} from "../../utils/http.status";

export default defineEventHandler(async (event) => {
    const client = event.context.api_client

    const url = getRequestURL(event);
    let urlDecode = decodeURIComponent(url.search.replace("?", ""));
    const query = parse(urlDecode);

    if (query.filter && typeof query.filter === "string") {
        query.filter = JSON.parse(query.filter);
    }
    if (query.aggregate && typeof query.aggregate === "string") {
        query.aggregate = JSON.parse(query.aggregate);
    }

    const findUser = await client.request(
        readUsers({
            ...query
        })
    ).catch((e: any) => {
        console.log(e.errors)
        return e;
    });

    return SuccessResponseStatus(findUser)
});
