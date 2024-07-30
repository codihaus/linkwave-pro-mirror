import {COOKIE_TOKEN} from "@directusLayer/utils/directus.token";
import {get, set} from "lodash-es";
import {APIService, APIUserService} from "@directusLayer/server/api-service";
import {HEADER_SDK_USER, HEADER_SDK_USER_VALUE} from "@directusLayer/config";

export default defineEventHandler(async (event) => {
    const headers = getHeaders(event);
    const cookies = parseCookies(event);
    const userAccessToken = get(cookies, COOKIE_TOKEN, null);

    let client = await APIService.getInstance()
    if (userAccessToken && (get(headers, HEADER_SDK_USER) === HEADER_SDK_USER_VALUE)) {
        client = APIUserService.getInstance(null, userAccessToken)
    }

    set(event.context, 'api_client', client)
})
