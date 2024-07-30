import {withoutTrailingSlash} from "ufo";
import {rest, authentication, createDirectus, graphql} from "@directus/sdk";
import {COOKIE_TOKEN} from "../utils/directus.token";

export class APIService {
    private static instance: any;
    private static url = process.env.NUXT_CMS_URL ?? "";
    private static token = process.env.NUXT_CMS_TOKEN ?? "";

    public static async getInstance() {
        if (!APIService.instance) {
            APIService.instance = createDirectus(
                withoutTrailingSlash(APIService.url)
            );
            APIService.instance = APIService.instance.with(authentication());
            APIService.instance = APIService.instance.with(rest());
            APIService.instance = APIService.instance.with(graphql());
        }

        APIService.instance.setToken(APIService.token);

        console.log({
            url: APIService.url,
            token: APIService.token
        })

        return APIService.instance;
    }
}

export class APIUserService {
    private static instance: any;
    private static url = process.env.NUXT_CMS_URL ?? "";

    public static getInstance(event, token = null) {
        if (!APIUserService.instance) {
            APIUserService.instance = createDirectus(
                withoutTrailingSlash(APIUserService.url)
            );
            APIUserService.instance = APIUserService.instance.with(authentication());
            APIUserService.instance = APIUserService.instance.with(rest());
            APIUserService.instance = APIUserService.instance.with(graphql());
        }

        if (!token && event) {
            const cookies = parseCookies(event);
            token = cookies[COOKIE_TOKEN];
        }

        APIUserService.instance.setToken(token);
        return APIUserService.instance
    }
}
