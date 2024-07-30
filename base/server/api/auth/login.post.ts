import {APIService, APIUserService} from "../../api-service";
import {COOKIE_TOKEN, COOKIE_REFRESH_TOKEN} from "../../utils/directus.token";
import {readMe} from "@directus/sdk";
import {ErrorAuth, SuccessResponseStatus} from "../../utils/http.status";
import {get} from "lodash-es";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const client = get(event.context, 'api_client');

    const login = await client
        .login(body.email, body.password, {
            mode: 'json'
        })
        .catch((e: any) => {
            console.log(e.errors)
            return e;
        });

    if (!login.access_token) {
        return ErrorAuth({})
    }

    let userModel = {};

    setCookie(event, COOKIE_TOKEN, login.access_token, {
        secure: true,
        maxAge: login.expires,
    });

    const apiUser = APIUserService.getInstance(null, login.access_token);
    userModel = await apiUser.request(
        readMe({
            fields: ["*", 'current_plan.plan']
        })
    ).catch((e: any) => {
        console.log(e.errors)
        return {};
    });

    return SuccessResponseStatus({
        ...login,
        user: userModel
    })
});
