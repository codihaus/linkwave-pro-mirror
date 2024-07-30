import {readAssetBlob} from "@directus/sdk"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const query = getQuery(event)
    const apiUser = event.context.api_client
    return apiUser.request(readAssetBlob(id as string, query))
})


