import {authentication, createDirectus, rest} from "@directus/sdk";
import {HEADER_SDK_USER, HEADER_SDK_USER_VALUE} from "~/config/constan";

export const useNAD = () => {
    const NADUrl = useNADUrl()

    let instance = createDirectus(NADUrl.url);

    const onRequest = async (config) => {
        if (!config.headers) {
            config.headers = {};
        }

        config.headers[HEADER_SDK_USER] = HEADER_SDK_USER_VALUE
        return config
    }

    instance = instance.with(authentication("json"));
    instance = instance.with(rest({
        onRequest
    }));

    instance = instance.with(authentication());

    return instance
}
