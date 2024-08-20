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
        <div class="container lg:px-0">
            <div class="py-3 px-4 lg:px-8 border-b border-neutral-05">
                <div class="font-semibold text-2xl leading-40px text-neutral-01">Cost Estimator</div>
            </div>
            <div class="px-4 py-6 lg:px-8 lg:py-8">
                <div class="text-lg mb-4 text-neutral-01">Files</div>
                <n-data-table
                    remote
                    ref="table"
                    :columns="columns"
                    :data="data"
                    :bordered="false"
                    style="
                        --n-th-color: transparent;
                        --n-td-color: transparent;
                        --n-border-color: #2E3133;
                        --n-th-text-color: #E8ECEF;
                        --n-td-text-color: #F0F5FB;
                        --n-td-color-hover: #444;
                    "
                />
                    <!-- :loading="pending"
                    :row-key="rowKey" -->
            </div>
        </div>

    </layout-view>
</template>
<script setup lang="ts">
import { readItems } from '@directus/sdk';
import LazyRightSidebar from './components/right-sidebar.vue'
import SubNavigation from './components/sub-navigation.vue'

definePageMeta({
	auth: true,
    sidebarCollapsed: true
})


const columns = [
    {
        title: 'FILE NAME',
        key: 'file.filename_disk',
        // sorter: true,
        // sortOrder: false
    },
    {
        title: 'COST ESTIMATE',
        key: 'cost',
    },
    {
        title: 'DATE UPLOAD',
        key: 'date_created'
    },
    {
        title: 'STATUS',
        key: 'status'
    }
]

const page = ref(1)
const api = useNAD()

// const { data, pending, refresh } = await useAsyncData(
//     () => api.request(readItems('files', {
//         // fields: [ 'status', 'file.title', 'file.filename_disk', 'date_created'],
//         // page: page.value,
//         limit: -1
//     })),
//     {
//         transform: (response) => {
//             console.log('response', response)
//             return response?.items || response
//         },
//         watch: [page]
//     }
// )

const data = ref([
    {
        file: {
            filename_disk: 'House-Floor-Plans.pdf'
        },
        date_created: '11 Sep 2023',
        status: 'Analysed',
        cost: '$141.147'
    },
    
    {
        file: {
            filename_disk: 'House-Floor-Plans.pdf'
        },
        date_created: '11 Sep 2023',
        status: 'Analysed',
        cost: '$141.147'
    },
    {
        file: {
            filename_disk: 'House-Floor-Plans.pdf'
        },
        date_created: '11 Sep 2023',
        status: 'Analysed',
        cost: '$141.147'
    },
    {
        file: {
            filename_disk: 'House-Floor-Plans.pdf'
        },
        date_created: '11 Sep 2023',
        status: 'Analysed',
        cost: '$141.147'
    },

])
</script>

<style lang="scss">

</style>