<template>
    <n-layout-sider
        bordered
        :collapsed="sidebarCollapsed"
        collapse-mode="width"
        :collapsed-width="68"
        :width="260"
        content-class="sidebar !overflow-hidden"
        @update:collapsed="sidebarCollapsed = $event"
        class="first-step-1 lt-lg:absolute z-99 sidebar lt-lg:transform lt-lg:transition-transform lt-lg:duration-350"
        :class="{'lt-lg:-translate-x-full': sidebarCollapsed}"
        >
        <div class="hidden p-5.5 bg-black leading-0">
            <n-button text @click="sidebarCollapsed=!sidebarCollapsed">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.4999 2.56641H1.49993C1.38207 2.56641 1.28564 2.66283 1.28564 2.78069V4.49498C1.28564 4.61284 1.38207 4.70926 1.49993 4.70926H22.4999C22.6178 4.70926 22.7142 4.61284 22.7142 4.49498V2.78069C22.7142 2.66283 22.6178 2.56641 22.4999 2.56641ZM22.4999 19.2807H1.49993C1.38207 19.2807 1.28564 19.3771 1.28564 19.495V21.2093C1.28564 21.3271 1.38207 21.4236 1.49993 21.4236H22.4999C22.6178 21.4236 22.7142 21.3271 22.7142 21.2093V19.495C22.7142 19.3771 22.6178 19.2807 22.4999 19.2807ZM22.4999 10.9236H1.49993C1.38207 10.9236 1.28564 11.02 1.28564 11.1378V12.8521C1.28564 12.97 1.38207 13.0664 1.49993 13.0664H22.4999C22.6178 13.0664 22.7142 12.97 22.7142 12.8521V11.1378C22.7142 11.02 22.6178 10.9236 22.4999 10.9236Z" fill="#F0F5FB"/>
                </svg>
            </n-button>
        </div>
        <div class="sidebar bg-neutral-07" :class="[sidebarCollapsed ? 'px-4' : 'px-3']">
            <!-- <n-button
                class="btn-new-request"
                type="primary"
                round
                block
                @click="createNewThread"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.8034 2.3584H11.1962C11.0534 2.3584 10.9819 2.42983 10.9819 2.57268V10.9834H3.00042C2.85756 10.9834 2.78613 11.0548 2.78613 11.1977V12.8048C2.78613 12.9477 2.85756 13.0191 3.00042 13.0191H10.9819V21.4298C10.9819 21.5727 11.0534 21.6441 11.1962 21.6441H12.8034C12.9462 21.6441 13.0176 21.5727 13.0176 21.4298V13.0191H21.0004C21.1433 13.0191 21.2147 12.9477 21.2147 12.8048V11.1977C21.2147 11.0548 21.1433 10.9834 21.0004 10.9834H13.0176V2.57268C13.0176 2.42983 12.9462 2.3584 12.8034 2.3584Z" fill="#0A142C"/>
                </svg>
                <span class="ml-4" :class="{'hidden': sidebarCollapsed}" >New Request</span>
                
            </n-button> -->
            <div class="py-6">
                <nuxt-link v-for="item in mainNavigation" :to="item?.to" class="menu-item py-3 flex items-center rounded hover:text-primary" :class="sidebarCollapsed ? 'justify-center' : 'px-5'" :active-class="item?.to?.startsWith('#') ? '' : 'active'">
                    <i class="text-2xl leading-0 flex-shrink-0" :class="item?.icon"></i>
                    <span v-if="!sidebarCollapsed" class="ml-5">{{ item?.label }}</span>
                </nuxt-link>
            </div>
            <n-scrollbar class="h-[calc(100dvh-346px)] leading-title p-4 border-t border-neutral-06">
                <div :class="{'hidden': sidebarCollapsed}">
                    <div class="flex items-center gap-5 text-sm text-neutral-04 font-medium">
                        <i class="i-custom-project-2 text-2xl leading-0 text-neutral-04"></i>
                        Recent Projects
                    </div>
                    <div class="space-y-4 mt-5  pb-6">
                        <!-- <nuxt-link v-for="thread in recentThreads" :to="{name: 'chat-thread', params: {id: getThreadParamID(thread?.id)}}" class="flex gap-2" @click="closeSidebarOnMobile">
                            <i class="inline-block text-xl i-ph:chat-bold flex-shrink-0"></i>
                            <div class="line-clamp-1 text-ellipsis">{{ thread?.title }}</div>
                        </nuxt-link> -->
                    </div>
                </div>
            </n-scrollbar>
            <div class="hidden text-content-02 pt-4 leading-title w-full absolute left-0 bottom-0 pb-10 bg-black"  :class="[sidebarCollapsed ? 'px-4' : 'px-5', ]">
                <div class="space-y-8">
                    <div class="flex gap-2 items-center">
                        <icons-help class="inline-block" />
                        <div :class="{'hidden': sidebarCollapsed}">Support</div> 
                    </div>
                    <div class="flex gap-2 items-center">
                        <icons-setting class="inline-block" />
                        <div :class="{'hidden': sidebarCollapsed}">Setting</div>
                    </div>
                </div>
            </div>
        </div>
    </n-layout-sider>
</template>

<script setup lang="ts">
import { readItems } from '@directus/sdk';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
// const greaterThanMd = breakpoints.greater('md')
const smallerThanLg = breakpoints.smaller('lg')
const greaterThanLg = breakpoints.greaterOrEqual('lg')

const route = useRoute()


const currentUser = useState('currentUser')
const sidebarCollapsed = useState('sidebarCollapsed', () => route.meta?.sidebarCollapsed)
sidebarCollapsed.value = route.meta?.sidebarCollapsed || false

const mainNavigation = ref([
    {
        label: 'Projects',
        to: '/',
        icon: 'i-custom-project'
    },
    {
        label: 'Communication',
        to: '#',
        icon: 'i-custom-message'
    },
    {
        label: 'Team Planner',
        to: '#',
        icon: 'i-custom-team'
    },
])

const menuOptions = ref([
    {
        label: 'Hello'
    }
])

const recentRequest = ref([
    {
        title: 'Estimate this floor plan'
    },
    {
        title: 'Find me a contractor nearby'
    },
])

// const { data: recentThreads, refresh } = await useAsyncData('recentThreads', () => useAPI(() => readItems('chat_thread', {
//     limit: 4,
//     sort: '-date_created',
//     filter: {
//         user_created: currentUser.value?.id
//     }
// })), {
//     transform: (response) => response?.items
// })

const refreshRecentThreads = useState('refreshRecentThreads', () => false)

watch(refreshRecentThreads, async() => {
    if(refreshRecentThreads.value === true) {
        // await refresh()
        refreshRecentThreads.value = false
    }
},  {
    immediate: true
})

preloadRouteComponents('/')

const refreshMessage = useState('refreshMessage', () => false)

const { width, height } = useWindowSize()

function createNewThread() {
    refreshMessage.value = true
    closeSidebarOnMobile()
    navigateTo({name: 'home'})
}

function closeSidebarOnMobile() {
    if( smallerThanLg.value ) {
        sidebarCollapsed.value = true
    }
}

watch([smallerThanLg, greaterThanLg], () => {
    console.log('route.meta.sidebarCollapsed', route.meta.sidebarCollapsed)
    closeSidebarOnMobile()
    if( route.meta?.sidebarCollapsed ) {
        sidebarCollapsed.value = true
        return
    }
    if( greaterThanLg.value ) {
        sidebarCollapsed.value = false
    }
})
</script>

<style lang="scss">
.sidebar {
    height: calc(100dvh - 68px);
}
.menu-item {
    @apply text-neutral-03 text-opacity-75 border border-transparent;
    &.active {
        @apply text-primary text-opacity-100 border-current;
    }
}

.btn-new-request {
    --n-height: 36px;
    --n-padding: 1px 10px;
}
.n-layout-sider--collapsed .btn-new-request {
    --n-height: 36px;
    --n-padding: 1px 0;
}
.n-layout-sider .n-scrollbar {
    // padding-bottom: 172px;
}
</style>