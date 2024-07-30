import stripe from 'stripe';
import {createError} from 'h3'
import {createItem, updateItem} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    let body = await readRawBody(event);
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const header = getHeaders(event)

    // Retrieve the event by verifying the signature using the raw body and secret.
    let dataParsed = await readBody(event);
    let signature = header["stripe-signature"];

    try {
        dataParsed = stripeInstance.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        throw createError({
            statusCode: 400,
            statusMessage: 'Webhook signature verification failed.'
        })
    }

    const {
        api_client
    } = event.context

    const itemPayload = {
        id: dataParsed.id,
        event_name: dataParsed.type,
        status: "callback",
        payload: JSON.stringify(dataParsed, null, 4),
    }

    const objectId = dataParsed.data?.object?.id

    await api_client.request(
        createItem(
            "stripe_object" as any,
            {
                id: objectId
            }
        )
    ).catch((e) => {})

    await api_client.request(
        updateItem(
            'stripe_object' as any,
            objectId,
            {
                name: dataParsed.type,
                latest_action: dataParsed.type,
                payload: JSON.stringify(dataParsed.data?.object, null, 4),
                logs: {
                    create: [
                        {
                           ...itemPayload,
                            object_id: objectId
                        }
                    ]
                }
            }
        )
    ).catch ((e) => { console.log(e) })

    return {
        success: true
    }
})
