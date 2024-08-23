<template>
    <layout-view>
        <template #header-right>
            <n-button type="primary" icon class="px-2" style="--n-height: 40px;" @click="navigateTo('/projects/+')">
                <i class="i-custom-plus text-2xl leading-0"></i>
            </n-button>
        </template>
        <template #right-sidebar>
            <lazy-right-sidebar />
        </template>
        <template #sub-navigation>
            <sub-navigation />
        </template>

    </layout-view>
</template>
<script setup lang="ts">
import { readItem } from '@directus/sdk';
import LazyRightSidebar from './components/right-sidebar.vue'
import SubNavigation from './components/sub-navigation.vue'

definePageMeta({
	auth: true,
    sidebarCollapsed: true
})

const route = useRoute()

const api = useNAD()
const { data: project } = await useProject()
</script>

<style lang="scss">

</style>