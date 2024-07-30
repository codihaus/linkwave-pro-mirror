export default [
    {
        name: "home",
        path: "/",
        file: "/chat/chat-thread.vue",
    },
    {
        name: "chat-thread",
        path: "/thread/:id?",
        file: "/chat/chat-thread.vue",
    },
    {
        name: "checkout-success",
        path: "/checkout/success",
        file: "/checkout/success.vue",
    },
    {
        name: "checkout-canceled",
        path: "/checkout/canceled",
        file: "/checkout/canceled.vue",
    },
]