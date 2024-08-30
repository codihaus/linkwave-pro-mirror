import {createError} from 'h3'
import {createItem, inviteUser, readUsers, updateItem} from "@directus/sdk";

export default defineEventHandler(async (event) => {
    let body = await readBody(event);

    const runtimeConfig = useRuntimeConfig()
    let invite_url = runtimeConfig.public.url + "/invite/accept"

    const {
        api_client
    } = event.context

    let project_members: any = {
        create: [],
        update: [],
        delete: []
    }
    const user2Invite = body?.project_members ?? []

    await api_client.request(inviteUser(user2Invite, process.env.NUXT_DEFAULT_ROLE)).catch((e) => {
        console.log('error invite user when create project', e?.errors)
    })

    const findUsers = body?.project_members ? await api_client.request(
        readUsers({
            limit: -1,
            filter: {
                email: {
                    _in: body?.project_members || []
                }
            }
        })
    ).then((response) => {
        response?.map(({id, email}) => {
            project_members.create.push({
                projects_id: '+',
                directus_users_id: {
                    id
                }
            })
        })
    }).catch((e) => {
        console.log('findUser when create Project error', e?.errors)
    }) : []

    const project = await api_client.request(createItem('projects', {
        ...body,
        project_members,
    })).catch((e) => {
        console.log('create Project error', e?.errors, e?.errors?.[0].message)
        throw createError({
            statusMessage: e?.errors?.[0].message
        })
    })

    return {
        success: true,
        project_members,
        project,
        body
    }
})
