<template>
    <layout-view>
        <template #header-right>
            <n-button type="primary" icon class="px-2" style="--n-height: 40px;" @click="showCreateProjectModal=true">
                <i class="i-custom-plus text-2xl leading-0"></i>
            </n-button>
        </template>
        <template #right-sidebar>
            <lazy-right-sidebar />
        </template>

        <div class="container">
            <div class="bg-hex-1A1D1E">

                <div class="py-3 px-4 lg:px-8 flex justify-between gap-3 border-b border-neutral-05">
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
                            <i class="i-custom-plus text-2xl leading-0"></i>
                            New Project
                        </n-button>
                    </template>
                </n-result>
                <div v-else class="px-4 py-5 lg:px-8 lg:py-8">
                    <div class="grid grid-cols-1 gap-8 text-white leading-1.5rem" :class="gridView ? 'md:grid-cols-2 lg:grid-cols-4' : ''">
                        <template v-if="!pending">
                            <div v-for="project in projects">
                                <div v-if="gridView" class="relative">
                                    <nuxt-link class="block relative aspect-r pb-1/1 bg-neutral-04 rounded">
                                    </nuxt-link>
                                    <div class="px-2 pb-2.5 absolute bottom-0 left-0 right-0">
                                        <nuxt-link class="px-3 py-2 text-center font-semibold text-lg rounded-lg bg-neutral-07 bg-opacity-95 line-clamp-1">{{ project?.name }}</nuxt-link>
                                    </div>
                                    <n-dropdown trigger="click" :options="actions" @select="selectAction">
                                        <n-button icon ghost text class="absolute top-0.5 right-0.5">
                                            <i class="i-custom-action text-2xl"></i>
                                        </n-button>
                                    </n-dropdown>
                                </div>
                                <nuxt-link v-else class="block md:flex gap-x-6 p-4 lg:p-6 rounded bg-neutral-07">
                                    <div class="md:w-32">
                                        <div class="block relative aspect-r pb-1/1 bg-neutral-04 rounded">
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
                                                <n-dropdown trigger="click" :options="actions" @select="selectAction">
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
                        </template>
                        <template v-else>
                            <div v-for="project in new Array(8).fill('')">
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
    <lazy-create-project v-model="showCreateProjectModal" />
</template>
<script setup lang="ts">
import { readItems, aggregate } from '@directus/sdk'
import LazyCreateProject from './components/create-project.vue'
import LazyRightSidebar from './components/right-sidebar.vue'
import { upperFirst, get } from 'lodash-es'


definePageMeta({
	auth: true
})

const currentUser = useState('currentUser')

const showCreateProjectModal = ref(false)
const gridView = ref(true)

const api = useNAD()

const page = ref(1)
const limit = ref(8)
const { data: projects, pending } = await useAsyncData(
    'projects',
    () => api.request(readItems('projects', {
        fields: ['name', 'logo', 'type', 'location.name', 'description'],
        // fields: ['*']
        filter: {
            _and: [
                {
                    status: {
                        _eq: 'published'
                    },
                },
                // {
                //     user_created: currentUser.value?.id   
                // }
            ]
        },
        limit: limit.value,
        page: page.value
    })),
    {
        transform: (response) => response?.items?.map((item) => ({
            ...item,
            location: item?.location?.name || '',
            type: `${upperFirst(item?.type)} buildings`
        })),
        watch: [page]
    }
)

const { data: totalPage } = await useAsyncData(() => api.request(aggregate('projects', {
    query: {
        filter: {
            _and: [
                {
                    status: {
                        _eq: 'published'
                    },
                },
                // {
                //     user_created: currentUser.value?.id   
                // }
            ]
        },
    },
    aggregate: {
        countDistinct: ['id']
    }
})), {
    transform: (response) => {
        response = response?.items
        let totalItems = Number(get(response, '0.countDistinct.id'))
        return Math.ceil(totalItems / limit.value) || 1
    }
} )


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

function selectAction(key: string | number) {
    
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