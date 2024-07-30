import {COOKIE_TOKEN, COOKIE_REFRESH_TOKEN} from "~/base/server/utils/directus.token";
import {APIService, APIUserService} from "~/base/server/api-service";
import {readMe, refresh} from "@directus/sdk";

export default defineNuxtRouteMiddleware(async (to) => {

    const cookieKey = useState("cookieKey", () => "")
    const accessToken = useState("accessToken")
    if (import.meta.server) {
        cookieKey.value = COOKIE_TOKEN
    }


    if (cookieKey.value) {
        const userCookie = useCookie(cookieKey.value)

        const currentUser = useState("currentUser")

        if (userCookie.value) {
            accessToken.value = userCookie.value
            const apiUserService = import.meta.server ? APIUserService.getInstance(null, userCookie.value) : useNAD()
            APIUserService?.instance?.setToken(accessToken.value)
            currentUser.value = await apiUserService.request(
                readMe({
                    fields: ["*", 'current_plan.plan']
                })
            ).then((response) => {
                return response?.items ? response?.items : response
            }).catch((e: any) => {
                console.log(e.errors)
                return e;
            })
        }

        if (to.meta?.auth && !currentUser.value?.id) {
            return navigateTo('/login')
        }

        if( ['login', 'register'].includes(to?.name) && currentUser.value?.id ) {
            return navigateTo('/')
        }
    }

})
