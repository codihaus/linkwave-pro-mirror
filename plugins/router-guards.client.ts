import { defineNuxtPlugin } from '#app'
import { useRouter } from 'vue-router'

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()

    router.afterEach((to, from) => {
        if( to?.meta?.layout === 'auth' ) {
            document.documentElement.classList.remove('overflow-hidden')
        } else {
            document.documentElement.classList.add('overflow-hidden')
        }
    })
})
