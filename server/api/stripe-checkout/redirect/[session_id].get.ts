import {updateItem} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const {
        public: {
            url: publicUrl
        }
    } = useRuntimeConfig()

    const session_id = getRouterParam(event, 'session_id');
    let {type} = getQuery(event);

    const {api_client}  = event.context
    await api_client.request(
        updateItem('stripe_logs', session_id, {
            status: type
        })
    ).catch((error) => {
        console.error(error);
    })

    if (type != 'success') {
        type = 'canceled'
    }

    return sendRedirect(event, `${publicUrl}/checkout/${type}`);
})
