<template>
    <layout-view>
        <template #header-right>
            <n-button type="primary" icon class="px-2" style="--n-height: 40px;" @click="navigateTo('/projects/+')">
                <i class="i-custom-plus text-2xl leading-0"></i>
            </n-button>
        </template>
        <!-- <template #right-sidebar>
            <lazy-right-sidebar />
        </template> -->
        <template #sub-navigation>
            <sub-navigation />
        </template>
        <div class="container lg:px-0">
            <div class="py-3 px-4 lg:px-8 border-b border-neutral-05">
                <div class="font-semibold text-2xl leading-40px text-neutral-01">Cost Estimator</div>
            </div>
            <div class="max-w-full overscroll-y-auto px-4 py-6 lg:px-8 lg:py-8">
                <!-- <div class="text-lg mb-4 text-neutral-01">Files</div> -->
                <n-data-table
                    remote
                    ref="table"
                    :columns="columns"
                    :data="floorFiles"
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
import { useSocket } from '~/app/composables/use-socket';
import { isEqual } from 'lodash-es';

definePageMeta({
	auth: true,
    sidebarCollapsed: true
})

const route = useRoute()

const notify = useNaiveNotification()

const columns = [
    {
        title: 'FILE NAME',
        key: 'file.filename_download',
        width: '30%',
        minWidth: 200,
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
        key: 'file.created_on',
        minWidth: 200,
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
            if( ['processing', 'recalculating'].includes(row?.status) ) {
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
            if( unsubscribeFiles !== null ) {
                unsubscribeFiles()
            }
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

const { data: floorFiles, pending, refresh } = await useAsyncData(
    () => api.request(readItems('files', {
        fields: [ 'id', 'status', 'file.filesize', 'file.filename_disk', 'file.filename_download', 'file.created_on' ],
        filter: {
            project: Number(route.params?.id),
            type: 'floor'
        },
        sort: '-date_created',
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

const { socket } = await useSocket()

let unsubscribeFiles = null

async function subscribe() {

    const { subscription, unsubscribe } = await socket?.value?.subscribe('files', {
        query: {
            filter: {
                project: Number(route.params?.id),
                type: 'construction'
            },
            fields: [ 'id', 'status', 'type', 'file.filesize', 'file.filename_disk', 'file.filename_download', 'file.created_on' ],
            sort: '-date_created',
        },
        uid: 'files'
    });

    unsubscribeFiles = unsubscribe

    for await (const sub of subscription) {

        if( sub?.event === 'init' ) {
            console.log('subscribe item files', sub);
        }

    }

    
}

const lastUpdate = useState('lastCostUpdate')

const message = useMessage()

onMounted(async () => {

    // let lastUpdate = null


    socket.value?.onWebSocket('message', function (socketMessage: any) {
        const { type, data, event, uid } = socketMessage;
        
        console.log('type', type)

        if( uid !== 'files' ) return

        if (event === 'create') {
            // floorFiles.value.unshift(data?.[0])
        }

        if (socketMessage.type === 'ping') {
            socket?.sendMessage({
                type: 'pong',
            });
        }
        
        if (event === 'update') {
            let construction = data?.map(({id, status}) => ({id, status}))?.find((item) => item?.status === 'completed')
            if( lastUpdate.value?.status === construction?.status ) {
                return
            }

            lastUpdate.value = construction
            
            console.log( 'construction', construction )
            if( construction?.status === 'completed' ) {
                notify.create({
                    type: 'info',
                    title: 'Calculating successfully!',
                    description: `Cost estimator has been calculated. Please check!`,
                    duration: 5000
                })
                message?.destroyAll()
            }

            floorFiles.value = floorFiles.value?.map((item) => ({
                ...item,
                status: construction?.status
            }))
        }
    });

    socket.value.onWebSocket('close', function () {
        console.log({ event: 'onclose' });
    });

    await subscribe()

})

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