<template>
    <n-layout-header bordered class="px-4 lg:px-10 py-4 flex items-center gap-5 sticky top-0 z-9">
        <div class="leading-0 lg:hidden">
            <n-button text @click="onCollapse">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.4999 2.56641H1.49993C1.38207 2.56641 1.28564 2.66283 1.28564 2.78069V4.49498C1.28564 4.61284 1.38207 4.70926 1.49993 4.70926H22.4999C22.6178 4.70926 22.7142 4.61284 22.7142 4.49498V2.78069C22.7142 2.66283 22.6178 2.56641 22.4999 2.56641ZM22.4999 19.2807H1.49993C1.38207 19.2807 1.28564 19.3771 1.28564 19.495V21.2093C1.28564 21.3271 1.38207 21.4236 1.49993 21.4236H22.4999C22.6178 21.4236 22.7142 21.3271 22.7142 21.2093V19.495C22.7142 19.3771 22.6178 19.2807 22.4999 19.2807ZM22.4999 10.9236H1.49993C1.38207 10.9236 1.28564 11.02 1.28564 11.1378V12.8521C1.28564 12.97 1.38207 13.0664 1.49993 13.0664H22.4999C22.6178 13.0664 22.7142 12.97 22.7142 12.8521V11.1378C22.7142 11.02 22.6178 10.9236 22.4999 10.9236Z" fill="#F0F5FB"/>
                </svg>
            </n-button>
        </div>
        <div>
            <layout-logo />
        </div>
        <div>
            <ul class="header-menu hidden md:flex md:gap-1 justify-center leading-normal">
                <li>
                    <a class="px-3 py-3 text-heading-02 hover:text-primary" href="https://linkwave.ai">Homepage</a>
                </li>
                <li v-for="item in menu">
                    <nuxt-link
                        class="px-3 py-3 text-heading-02 hover:text-primary"
                        :to="item?.to"
                        :href="item?.to"
                        :active-class="getActiveClass(item)"
                    >
                        <span class="text" :title="item?.label">{{ item?.label }}</span>
                    </nuxt-link>
                </li>
            </ul>

        </div>
        <div class="ml-auto flex items-center gap-5">
            <div id="header-analyzing"></div>
            <n-dropdown trigger="click" placement="bottom-end" :options="options" @select="handleSelect">
                <div class=" flex items-center gap-2 text-heading-02">
                    {{ currentUser?.first_name }}
                    <n-avatar
                        round
                        size="small"
                        :src="avatar"
                    >
                        <template v-if="!avatar">
                            {{ currentUser?.first_name?.at(0) || '' }}{{ currentUser?.last_name?.at(0) || '' }}
                        </template>
                    </n-avatar>
                    <i class="i-custom-down"></i>
                </div>
            </n-dropdown>
        </div>
    </n-layout-header>
</template>

<script setup lang="ts">
import { readItem } from '@directus/sdk';
import { set } from 'lodash-es';
import analyzerFile from '~/app/views/chat/components/analyzer-file.vue';
import { LayoutHeaderProfileMenu } from '#components'

const route = useRoute()

const currentUser = useState("currentUser")
const avatar = computed(() => currentUser.value?.avatar ? useCMSUrl(`assets/${currentUser.value?.avatar}`) : null)

const menu = ref([
    {
        label: 'Chatbot',
        to: '/',
    },
    {
        label: 'Marketplace',
        to: '#',
    },
])

function getActiveClass(item) {
    return !item?.to?.startsWith('#') ? 'active border-primary text-primary' : ''
}

const options = ([
    {
        key: 'menu',
        type: 'render',
        render: () => h(LayoutHeaderProfileMenu, {})
    },
])

function handleSelect(key: string | number) {
    if( key === 'logout' ) {
        logout()
    }
}

const nuxtApiAuth = useNADAuth()

const analyzeSocket = useState('analyzeSocket')

async function logout() {
    nuxtApiAuth.logout()
    await analyzeSocket.value?.disconnect()
    navigateTo('/login')
}


const sidebarCollapsed = useState('sidebarCollapsed', () => false)

const emit = defineEmits(['collapsed'])

function onCollapse() {
    sidebarCollapsed.value = !sidebarCollapsed.value
}

</script>
<style lang="scss">
.active {
    border-bottom: 2px solid;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: linear-gradient(0deg, rgba(20, 227, 174, 0.5) 0%, rgba(20, 227, 174, 0) 43.48%);
}
</style>