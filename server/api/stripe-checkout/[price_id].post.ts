import stripe from 'stripe';
import {createItem, readMe} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    const {
        public: {
            url: publicUrl
        }
    } = useRuntimeConfig()

    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    const priceId = getRouterParam(event, 'price_id');
    const {api_client} = event.context;

    if (!priceId){
        return {
            statusCode: 400,
            body: 'Price ID is required'
        }
    }

    const {
        quantity
    } = await readBody(event);


    const user = await api_client.request(readMe()).catch(() => {return {}});

    const session = await stripeInstance.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
            {
                price: priceId,
                quantity: quantity,
            },
        ],
        subscription_data: {
            metadata: {
                user: user.id
            }
        },
        success_url: `${publicUrl}/api/stripe-checkout/redirect/{CHECKOUT_SESSION_ID}?type=success`,
        cancel_url: `${publicUrl}/api/stripe-checkout/redirect/{CHECKOUT_SESSION_ID}?type=error`,
    });

    const itemPayload = {
        id: session.id,
        event_name: session.object,
        status: "created",
        payload: JSON.stringify(session, null, 4)
    }

   const checkoutLog = await api_client.request(
        createItem("stripe_logs" as any, itemPayload)
    ).catch(() => false);


    if (!checkoutLog) {
        return {
            statusCode: 500,
            body: 'Error creating checkout log'
        }
    }

    return {
        statusCode: 200,
        session
    };
})
