import { readItem } from '@directus/sdk';

export async function useProject(projectID: number | string | null = null) {
    
    const route = useRoute()

    projectID = projectID || route.params?.id

    const api = useNAD()
    return await useAsyncData(
        () => api.request(readItem('projects', projectID)),
    )
}