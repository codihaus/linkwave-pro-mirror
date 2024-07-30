import {withoutTrailingSlash} from "ufo";
import {rest, authentication, createDirectus, graphql} from "@directus/sdk";
import {COOKIE_TOKEN} from "@directusLayer/utils/directus.token";

export class APIService {
    private static instance: any;
    private static url = process.env.NUXT_CMS_URL ?? "";
    private static token = process.env.NUXT_CMS_TOKEN ?? "";

    public static async getInstance() {
        if (!APIService.instance) {
            APIService.instance = createDirectus(
                withoutTrailingSlash(APIService.url)
            );
            APIService.instance = APIService.instance.with(authentication('json'));
            APIService.instance = APIService.instance.with(rest());
            APIService.instance = APIService.instance.with(graphql());

        }
        APIService.instance.setToken(APIService.token);
        return APIService.instance;
    }
}

export class APIUserService {
    private static instance: any;
    private static url = process.env.NUXT_CMS_URL ?? "";

    public static getInstance(event: any, token: any = null) {
        let instance = createDirectus(
            withoutTrailingSlash(APIUserService.url)
        );
        instance = instance.with(authentication('json'));
        instance = instance.with(rest());
        instance = instance.with(graphql());

        if (!token && event) {
            const cookies = parseCookies(event);
            token = cookies[COOKIE_TOKEN];
        }

        instance.setToken(token);
        return instance
    }
}
