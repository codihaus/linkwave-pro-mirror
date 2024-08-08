import { customEndpoint } from "@directus/sdk";

export async function useQuota(options = {}) {
    const api = useNAD()
    return await useAsyncData(
        'quota',
        () => api.request(customEndpoint({
            method: 'GET',
            path: '/quota-plan/check'
        })),
        {
            lazy: true,
            ...options,
        }
    )
}