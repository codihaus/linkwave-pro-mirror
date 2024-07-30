export default [
    {
        name: "login",
        path: "/login",
        file: "/auth/login.vue",
        meta: {
            layout: 'auth',
            // middleware: 'guest'
        }
    },
    {
        name: "logout",
        path: "/logout",
        file: "/auth/logout.vue",
    },
    {
        name: "register",
        path: "/register",
        file: "/auth/register.vue",
        meta: {
            layout: 'auth',
            // middleware: 'guest'
        }
    },
    {
        name: "forgot-password",
        path: "/reset-password",
        file: "/auth/forgot-password.vue",
        meta: {
            layout: 'auth',
            // middleware: 'guest'
        }
    },
]