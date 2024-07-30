import {COOKIE_TOKEN, COOKIE_REFRESH_TOKEN} from "../../utils/directus.token";

export default defineEventHandler(async (event) => {
    setCookie(
        event,
        COOKIE_TOKEN,
        null,
        {
            secure: true,
            maxAge: 0,
        });

    return {
        status: 200,
        data: {},
    };
});
