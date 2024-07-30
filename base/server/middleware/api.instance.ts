import {COOKIE_TOKEN} from "../utils/directus.token";
import {get, set} from "lodash-es";
import {HEADER_SDK_USER, HEADER_SDK_USER_VALUE} from "../../../config/constan";
import {APIService, APIUserService} from "../api-service";

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
