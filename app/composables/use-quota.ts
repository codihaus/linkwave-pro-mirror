import { customEndpoint } from "@directus/sdk";

export async function useQuota() {
    const api = useNAD()
    return await useAsyncData(
        'quota',
        () => api.request(customEndpoint({
            method: 'GET',
            path: '/quota-plan/check'
        }))
    )
}