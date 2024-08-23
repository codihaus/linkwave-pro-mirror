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
                <!-- <div class="text-lg mb-4 text-neutral-01">Files</div> -->
                <n-data-table
                    remote
                    ref="table"
                    :columns="columns"
                    :data="data"
                    :row-props="rowProps"
                    :bordered="false"
                    style="
                        --n-th-color: transparent;
                        --n-td-color: transparent;
                        --n-border-color: #2E3133;
                        --n-th-text-color: #E8ECEF;
                        --n-td-text-color: #F0F5FB;
                        --n-td-color-hover: #444;
                        --n-td-padding: 16px;
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
import LazyRightSidebar from '../components/right-sidebar.vue'
import SubNavigation from '../components/sub-navigation.vue'
import { NTag } from 'naive-ui';
import millify from 'millify'

definePageMeta({
	auth: true,
    sidebarCollapsed: true
})

const route = useRoute()

const columns = [
    {
        title: 'FILE NAME',
        key: 'file.filename_download',
        width: '30%',
        ellipsis: {
            tooltip: true
        }
        // sorter: true,
        // sortOrder: false
    },
    // {
    //     title: 'COST ESTIMATE',
    //     key: 'cost',
    // },
    {
        title: 'DATE UPLOAD',
        key: 'file.created_on'
    },
    {
        title: 'FILESIZE',
        key: 'file.filesize',
        width: 100,
    },
    {
        title: 'STATUS',
        key: 'status',
        width: 140,
        render: (row) => {
            let type: string = 'default'
            if( row?.status === 'completed' ) {
                type = 'success'
            }
            if( row?.status === 'processing' ) {
                type = 'info'
            }
            if( row?.status === 'pending' ) {
                type = 'warning'
            }
            if( row?.status === 'error' ) {
                type = 'error'
            }
            return h(NTag, {
                type,
                round: true,
                bordered: false,
            }, row?.status)
        }
    }
]

function rowProps(row) {
    return {
        style: 'cursor: pointer;',
        onClick: () => {
            navigateTo({
                name: 'project-cost-estimator-detail',
                params: {
                    id: route.params?.id,
                    file_id: row?.id
                }
            })
        }
    }
}

const page = ref(1)
const limit = ref(20)
const api = useNAD()

const { data, pending, refresh } = await useAsyncData(
    () => api.request(readItems('files', {
        fields: [ 'id', 'status', 'file.filesize', 'file.filename_disk', 'file.filename_download', 'file.created_on' ],
        filter: {
            project: Number(route.params?.id),
            type: 'floor'
        },
        page: page.value,
        limit: limit.value
    })),
    {
        server: false,
        default: () => ([]),
        transform: (response) => {
            console.log('response', response)
            return response?.items?.map((item) => ({
                ...item,
                file: {
                    ...item?.file,
                    created_on: item?.file?.created_on ? formatDateString(item?.file?.created_on) : '',
                    filesize: millify(item?.file?.filesize, {
                        units: ["B", "KB", "MB", "GB", "TB"],
                    })
                }
            })) || []
        },
        watch: [page]
    }
)

console.log('data', data.value)

// const data = ref([
//     {
//         file: {
//             filename_disk: 'House-Floor-Plans.pdf'
//         },
//         date_created: '11 Sep 2023',
//         status: 'Analysed',
//         cost: '$141.147'
//     },
    
//     {
//         file: {
//             filename_disk: 'House-Floor-Plans.pdf'
//         },
//         date_created: '11 Sep 2023',
//         status: 'Analysed',
//         cost: '$141.147'
//     },
//     {
//         file: {
//             filename_disk: 'House-Floor-Plans.pdf'
//         },
//         date_created: '11 Sep 2023',
//         status: 'Analysed',
//         cost: '$141.147'
//     },
//     {
//         file: {
//             filename_disk: 'House-Floor-Plans.pdf'
//         },
//         date_created: '11 Sep 2023',
//         status: 'Analysed',
//         cost: '$141.147'
//     },

// ])
</script>

<style lang="scss">

</style>