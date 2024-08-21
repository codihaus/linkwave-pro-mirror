<template>
    <layout-view>
        <template #header-right>
            <n-popover trigger="hover">
                <template #trigger>
                    <n-button type="primary" icon class="px-2" style="--n-height: 40px;" @click="showCreateProjectModal=true">
                        <i class="i-custom-add text-2xl leading-0"></i>
                    </n-button>
                </template>
                <span>Create project</span>
            </n-popover>
        </template>
        <div class="container">
            <div class="bg-hex-1A1D1E">

                <div class="py-3 xpx-4 lg:xpx-8 flex justify-between gap-3 border-b border-neutral-05">
                    <div class="font-semibold text-2xl leading-40px text-neutral-01">Projects</div>
                    <div class="flex gap-3">
                        <n-button icon text :class="{'text-primary': gridView}" @click="gridView = true">
                            <template #icon>
                                <i class="i-custom-grid"></i>
                            </template>
                        </n-button>
                        <n-button icon text :class="{'text-primary': !gridView}" @click="gridView = false">
                            <template #icon>
                                <i class="i-custom-list"></i>
                            </template>
                        </n-button>
                    </div>
                </div>
                
                <n-result v-if="projects?.length < 1 && totalPage < 2" status="success" title="" description="No project found" class="pt-20 text-neutral-04">
                    <template #icon>
                        <span></span>
                    </template>
                    <template #footer>
                        <n-button type="primary" class="px-6" style="--n-height: 40px;" @click="showCreateProjectModal=true">
                            <i class="i-custom-add text-2xl leading-0 mr-2"></i>
                            New Project
                        </n-button>
                    </template>
                </n-result>
                <div v-else class="py-5 xpx-4 lg:xpx-8 lg:py-8">
                    <div class="min-h grid grid-cols-1 gap-10 xxl:gap-12 text-white leading-1.5rem" :class="gridView ? 'md:grid-cols-2 lg:grid-cols-4' : ''">
                        <template v-if="!pending">
                            <div v-for="project in projects">
                                <div v-if="gridView" class="relative">
                                    <nuxt-link :to="getProjectRoute(project?.id)" class="block relative aspect-r pb-1/1 rounded" :class="{'bg-neutral-04': !project?.logo}">
                                        <img v-if="project?.logo" :src="project?.logo" class="object-cover">
                                    </nuxt-link>
                                    <div class="px-2 pb-2.5 absolute bottom-0 left-0 right-0">
                                        <nuxt-link :to="getProjectRoute(project?.id)" class="px-3 py-2 text-center font-semibold text-lg rounded-lg bg-neutral-07 bg-opacity-95 line-clamp-1" :title="project?.name">{{ project?.name }}</nuxt-link>
                                    </div>
                                    <n-dropdown trigger="click" :options="actions" @select="selectAction($event, project?.id)">
                                        <n-button icon ghost text class="absolute top-0.5 right-0.5">
                                            <i class="i-custom-action text-2xl"></i>
                                        </n-button>
                                    </n-dropdown>
                                </div>
                                <nuxt-link v-else :to="getProjectRoute(project?.id)" class="block md:flex gap-x-6 p-4 lg:p-6 rounded bg-neutral-07">
                                    <div class="md:w-32">
                                        <div class="block relative aspect-r pb-1/1 rounded" :class="{'bg-neutral-04': !project?.logo}">
                                            <img v-if="project?.logo" :src="project?.logo" class="object-cover">
                                        </div>
                                    </div>
                                    <div class="flex-grow">
                                        <div class="md:flex justify-between gap-8 xl:gap-24 items-center">
                                            <div class="mr-auto">
                                                <div class="text-xs text-neutral-04">Project’s name</div>
                                                <div>{{ project?.name }}</div>
                                            </div>
                                            <div>
                                                <div class="text-xs text-neutral-04">Type of construction</div>
                                                <div>{{ project?.type }}</div>
                                            </div>
                                            <div>
                                                <div class="text-xs text-neutral-04">State</div>
                                                <div>{{ project?.location }}</div>
                                            </div>
                                            <div>
                                                <n-dropdown trigger="click" :options="actions" @select="selectAction($event, project?.id)">
                                                    <n-button icon ghost text class="text-neutral-03">
                                                        <i class="i-custom-action text-2xl"></i>
                                                    </n-button>
                                                </n-dropdown>
                                            </div>
                                        </div>
                                        <div class="mt-3">
                                            <div class="text-xs text-neutral-04">Description</div>
                                            <div class="text-sm text-neutral-03 text-opacity-75">{{ project?.description }}</div>
                                        </div>
                                    </div>
                                </nuxt-link>
                            </div>
                            <template v-if="projects?.length < limit">
                                <div v-for="pr in new Array(limit - projects?.length).fill('1')" class="hidden lg:block">
                                    <div class="block relative aspect-r pb-1/1"></div>
                                </div>
                            </template>
                        </template>
                        <template v-else>
                            <div v-for="project in new Array(limit).fill('')">
                                <div v-if="gridView" class="relative">
                                    <div class="block relative aspect-r pb-1/1 rounded bg-neutral-04">
                                        <n-skeleton text :sharp="false"/>
                                    </div>
                                    <div class="px-2 pb-2.5 absolute bottom-0 left-0 right-0">
                                        <div class="px-3 py-2 text-center font-semibold text-lg rounded-lg bg-neutral-07 bg-opacity-95 line-clamp-1">
                                            <n-skeleton text :sharp="false"/>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="block md:flex gap-x-6 p-4 lg:p-6 rounded bg-neutral-07">
                                    <div class="md:w-32">
                                        <div class="block relative aspect-r pb-1/1 bg-neutral-04 rounded">
                                            <n-skeleton text :sharp="false"/>
                                        </div>
                                    </div>
                                    <div class="flex-grow">
                                        <div class="md:flex justify-between gap-8 xl:gap-24 items-center">
                                            <div class="w-14 mr-auto">
                                                <div class="text-xs text-neutral-04"><n-skeleton text :sharp="false"/></div>
                                                <div><n-skeleton text :sharp="false"/></div>
                                            </div>
                                            <div class="w-20">
                                                <div class="text-xs text-neutral-04"><n-skeleton text :sharp="false"/></div>
                                                <div><n-skeleton text :sharp="false"/></div>
                                            </div>
                                            <div class="w-14">
                                                <div class="text-xs text-neutral-04"><n-skeleton text :sharp="false"/></div>
                                                <div><n-skeleton text :sharp="false"/></div>
                                            </div>
                                            <div>
                                                <n-skeleton text style="width: 32px" :sharp="false"/>
                                            </div>
                                        </div>
                                        <div class="mt-3">
                                            <div class="text-xs text-neutral-04">
                                                <n-skeleton text style="width: 64px" :sharp="false"/>
                                            </div>
                                            <div class="text-sm text-neutral-03 text-opacity-75">
                                                <n-skeleton text :sharp="false"/>
                                                <n-skeleton text style="width: 60%" :sharp="false"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <n-pagination v-if="totalPage > 1" v-model:page="page" :page-count="totalPage" size="large" class="mt-6 justify-center" />
                </div>
            </div>
        </div>
    </layout-view>
    <lazy-create-project v-model="showCreateProjectModal" @create="refresh"/>
</template>
<script setup lang="ts">
import { readItems, aggregate, deleteItem } from '@directus/sdk'
import LazyCreateProject from './components/create-project.vue'
import { upperFirst, get } from 'lodash-es'


definePageMeta({
	auth: true,
    sidebarCollapsed: false
})

const currentUser = useState('currentUser')
const route = useRoute()
const { getCMSUrl } = useCMSUrl()

const showCreateProjectModal = ref(route?.params?.id === '+')
const gridView = ref(true)

const searchInput = useState('searchInput')

const api = useNAD()

const page = ref(1)
const limit = ref(8)
const { data: projects, pending, refresh: refreshProjects } = await useAsyncData(
    'projects',
    () => api.request(readItems('projects', {
        fields: ['id', 'name', 'logo', 'type', 'location.name', 'description'],
        // fields: ['*'],
        search: searchInput.value || '',
        filter: {
            _and: [
                {
                    status: {
                        _eq: 'published'
                    },
                },
            ],
        },
        sort: '-date_created',
        limit: limit.value,
        page: page.value
    })),
    {
        transform: (response) => response?.items?.map((item) => ({
            ...item,
            logo: item?.logo ? getCMSUrl(`assets/${item?.logo}`) : null,
            location: item?.location?.name || '',
            type: `${upperFirst(item?.type)} buildings`
        })),
        watch: [page, searchInput],
        default: () => new Array(8).fill('')
    }
)

const { data: totalPage, refresh: refreshTotalPage } = await useAsyncData(() => api.request(aggregate('projects', {
    query: {
        search: searchInput.value || '',
        filter: {
            _and: [
                {
                    status: {
                        _eq: 'published'
                    },
                },
            ]
        },
        sort: '-date_created',
    },
    aggregate: {
        countDistinct: ['id']
    }
})), {
    transform: (response) => {
        response = response?.items
        let totalItems = Number(get(response, '0.countDistinct.id'))
        return Math.ceil(totalItems / limit.value) || 1
    },
    watch: [searchInput]
} )

function refresh() {
    refreshProjects()
    refreshTotalPage()
}

const actions = ref([
    {
        label: 'Edit',
        key: 'edit'
    },
    {
        label: 'Delete',
        key: 'delete'
    },
])

async function selectAction(key: string | number, id) {
    if( key === 'edit' ) {
        navigateTo(getProjectRoute(id))
    }
    if( key === 'delete' ) {
        await deleteProject(id)
    }
}

function getProjectRoute(id) {
    return {
        name: 'project-cost-estimator',
        params: {
            id
        }
    }
}


const deleting = ref(false)
const notify = useNaiveNotification()

async function deleteProject(id) {
    deleting.value = true
    try {
        await api.request(
            deleteItem("projects", id)
        )
        notify.create({
            title: 'Successfully!',
            type: 'success',
            description: 'Project has been deleted successfully!',
            duration: 3000
        })
        refresh()
    } catch (error) {
        notify.create({
            title: 'Failed!',
            type: 'error',
            description: `Please try again`,
            duration: 3000
        })
    } finally {
        deleting.value = false
    }
}
</script>

<style lang="scss">
.n-result {
    --n-font-size: 24px;
}
.n-result .n-result-footer {
    margin-top: 40px;
}
</style>