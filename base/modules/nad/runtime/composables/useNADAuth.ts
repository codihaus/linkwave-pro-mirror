import {readMe, registerUser, createUser} from "@directus/sdk";
import {useNADLoading} from "~/base/modules/nad/runtime/composables/useNADLoading";
import {useNAD} from "~/base/modules/nad/runtime/composables/useNAD";

export const useNADAuth = () => {
    const api = useNAD()

    const nuxtApp = useNuxtApp()
    const asyncHandle = useNADLoading()
    const user = useState(`currentUser`)

    const login = async (email: string, pass: string) => {
        return asyncHandle.process(async () => {
            const response = await api.login(email, pass).catch((e) => {
                return {}
            });
            
            if (response?.user) {
                setUserLogin(response.user)
            }

            return response
        })
    }

    const setUserLogin = (userInfo: any) => {
        user.value = userInfo
        nuxtApp.$auth.status = !!userInfo.id
        nuxtApp.$auth.user = userInfo ?? {}
    }

    const getMe = async () => {
        return asyncHandle.process(async () => {
            await api.request(
                readMe({
                    fields: ["*", "current_plan.plan"]
                })
            );
        })
    }

    const logout = async () => {
        await asyncHandle.process(async () => {
            api.logout()
            setUserLogin({})
        });
    }

    const register = async(credentials) => asyncHandle.process(async () => {
        console.log('register', createUser(credentials))
        return await api.request(createUser(credentials)).catch((e) => {
            return e
        });
    })

    return {
        login,
        logout,
        getMe,
        register,
        user,
        loading: computed(() => asyncHandle.loading)
    }
}
