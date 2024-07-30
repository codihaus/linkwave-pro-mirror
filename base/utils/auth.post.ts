import {
    SuccessResponseStatus,
    FailedResponseStatus,
} from "./http.status";
import { consola } from "consola";
import { Directus } from "@directus/sdk";
import { CookieSerializeOptions } from "cookie-es";
import { defineEventHandler } from "h3";

type TypeAuth = {
    email: string;
    password: string;
};

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const directus = new Directus(runtimeConfig.cms.url);

    try {
        //let query = getQuery(event)
        //Body raw JSON
        let body = await readBody(event);

        let { email, password } = body as TypeAuth;

        if (!email || !password) throw new Error("Payload is not allowed");

        let { access_token, refresh_token, expires } =
            await directus.auth.login({
                email,
                password,
            });

        if (!access_token || !refresh_token || !expires)
            throw new Error("Response error");
        //consola.info({access_token, refresh_token, expires})

        setCookie(event, "cms_access_token", access_token, {
            cookie: { expires },
        } as CookieSerializeOptions);
        setCookie(event, "cms_refresh_token", refresh_token, {
            cookie: { expires },
        } as CookieSerializeOptions);

        return SuccessResponseStatus({
            data: "Login success",
        });
    } catch (e: any) {
        consola.error("ERR Auth : ", e.message);
        consola.debug(e);

        return FailedResponseStatus({
            data: "Login failed",
        });
    }
});
