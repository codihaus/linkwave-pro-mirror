// Get config from api
// Create Open AI instance

import {APIService} from "~/base/server/api-service";
import {readSingleton} from "@directus/sdk";
import {openai} from "~/server/commons/openAI";

const backendConfig = {
    value: {},
    last_updated: 0
}

export default defineEventHandler(async (event) => {

    const newTime = (new Date()).getTime();

    if (
        (event.path.startsWith("/api/chat") && newTime >= backendConfig.last_updated)
        || !backendConfig.value.api_key
    ) {

        const api = await APIService.getInstance()
        const configBackend: any = await api.request(readSingleton("app_settings", {
            fields: ["api_key", "ass_id"],
        })).catch((e: any) => {
            throw createError({
                statusCode: 404,
                statusMessage: 'Init Connection Error'
            })
        })

        backendConfig.value = configBackend
        backendConfig.last_updated = newTime + 10 * 60 * 1000 // 10 minutes
    }

    process.env.OPENAI_API_KEY = backendConfig.value.api_key;
    event.context.assistant_id = backendConfig.value.ass_id;

    event.context.openai = openai()
})
