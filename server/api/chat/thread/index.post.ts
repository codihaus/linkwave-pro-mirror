import {createItem} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const {
        openai,
        assistant_id
    } = event.context

    const thread = await openai.beta.threads.create();

    const body = await readBody(event);

    event.context.api_client.request(
        createItem(
            "chat_thread" as never,
            {
                id: thread.id,
                assistant_id: assistant_id,
                title: body?.title || ''
            } as never
        )
    )

    return {
        statusCode: 200,
        thread: thread,
    }
})
