<template>
    <layout-view>
        <template #header-right>
            <n-button type="primary" icon class="px-2" style="--n-height: 40px;" @click="navigateTo('/projects/+')">
                <i class="i-custom-plus text-2xl leading-0"></i>
            </n-button>
        </template>
        <!-- <template #right-sidebar>
            <lazy-right-sidebar />
        </template>
        <template #sub-navigation>
            <sub-navigation />
        </template> -->
        <div class="">
            <div class="flex items-center gap-3 py-3 px-4 lg:px-8 bg-dark-05">
                <nuxt-link :to="goBack()">
                    <i class="i-custom-arrow-narrow-left text-2xl leading-0 text-neutral-01"></i>
                </nuxt-link>
                <div class="font-semibold text-neutral-01">Estimation</div>
                <div class="ml-auto">GRAND TOTAL: $141.147</div>
            </div>
            <div class="grid gap-5 lg:grid-cols-4 p-5 bg-hex-191B1B">
                <div class="p-3 rounded border border-neutral-01 border-opacity-10 bg-neutral-07">
                    <div class="text-white mb-3">PROPERTY OWNER</div>
                    <div class="text-neutral-03 text-opacity-75 leading-loose">
                        <div>Hong and Kim Pham</div>
                        <div>(323) 574-1508</div>
                        <div>hppzz@yahoo.com</div>
                    </div>
                </div>
                <div class="p-3 rounded border border-neutral-01 border-opacity-10 bg-neutral-07">
                    <div class="text-white mb-3">SCOPE OFWORK</div>
                    <div class="text-neutral-03 text-opacity-75 leading-loose">
                        <div>PROPOSED ONE STORY TYPE V DETACH ADU 496 SQ FT</div>
                        <div>Tel: (423) 369-4717</div>
                        <div>Email: Johndoe@gmail.com</div>
                        <div>Add: 14391 Starsia St Westminster CA 92683</div>
                    </div>
                </div>
                <div class="p-3 rounded border border-neutral-01 border-opacity-10 bg-neutral-07">
                    <div class="text-white mb-3">REGIONAL</div>
                    <div class="text-neutral-03 text-opacity-75 leading-loose">
                        <div>1740 Gillette Crescent, South</div>
                        <div>South Pasadena, CA 91030</div>
                    </div>
                </div>
                <div class="p-3 rounded border border-neutral-01 border-opacity-10 bg-neutral-07">
                    <div class="text-white mb-3">NAME OF FILE</div>
                    <div class="text-neutral-03 text-opacity-75 leading-loose">
                        <div>Remodeling Main house+Additional Room 287 Sqft.</div>
                    </div>
                </div>
            </div>
            <div class="">
                <n-data-table
                    :columns="columns"
                    :data="rows"
                    :row-key="(row) => row.expand"
                    default-expand-all
                    :single-line="false"
                    style="
                        --n-th-color: #14E3AE;
                        --n-td-color: transparent;
                        --n-border-color: #2E3133;
                        --n-th-text-color: #100F0F;
                        --n-td-text-color: #F0F5FB;
                        --n-td-color-hover: #444;
                        --n-td-padding: 16px;
                    "
                />
                <!-- <n-table
                    :bordered="false"
                    :single-line="false"
                    style="
                        --n-th-color: #14E3AE;
                        --n-td-color: transparent;
                        --n-border-color: #2E3133;
                        --n-th-text-color: #100F0F;
                        --n-td-text-color: #F0F5FB;
                        --n-td-color-hover: #444;
                        --n-td-padding: 16px;
                    "
                >
                    <thead>
                        <tr>
                            <th v-for="th in columns">{{ th.title }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="group, index in groups">
                            <td colspan="6">{{ group?.name }}</td>
                            <td>123</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Chuẩn Bị</td>
                            <td>Đào đất làm đường ống nước và foundation</td>
                            <td>Gói</td>
                            <td>1</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Dọn Dẹp Rác</td>
                            <td>Dọn dẹp rác thải xây dựng</td>
                            <td>Lần</td>
                            <td>4</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </n-table> -->
                <!-- <n-data-table
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
                        --n-td-padding: 16px;
                    "
                /> -->
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
import { arrayToTree } from 'performant-array-to-tree';

definePageMeta({
	auth: true,
    sidebarCollapsed: true,
    hideSidebar: true
})

const route = useRoute()

function goBack() {
    return {
        name: 'project-cost-estimator',
        params: {
            id: route.params?.id
        }
    }
}

const { data: project } = await useProject()

const columns = [
    {
        title: '',
        key: 'no',
        // width: '30%',
        render: (rowData, rowIndex) => {
            console.log('')
        },
    },
    {
        title: 'Items group',
        key: 'name',
        colSpan: (rowData, rowIndex) => {
            let colSpan = 1
            if(rowData?.type === 'group') {
                colSpan = 6
            }

            return colSpan
        }
    },
    {
        title: 'Description',
        key: 'description'
    },
    {
        title: 'Unit',
        key: 'unit',
        width: 80,
    },
    {
        title: 'Quantity',
        key: 'quantity',
        width: 120
    },
    {
        title: 'Unit cost ($)',
        key: 'cost_price',
        width: 120
    },
    {
        title: 'Selling Price ($)',
        key: 'selling_price',
        width: 140
    },
    {
        title: 'Final price($)',
        key: 'final_price',
        width: 120
    },
    {
        title: 'Note',
        key: 'note',
        width: 220
    },
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

const { data: groups, pending, refresh } = await useAsyncData(
    () => api.request(readItems('estimator_group', {
        fields: [ 'status', 'name', 'description' ],
        limit: -1
    })),
    {
        transform: (response) => {
            console.log('response', response)
            return response?.items?.map((item) => ({
                ...item,
                type: 'group',
                expand: true,
                children: []
            }))
        },
    }
)

const { data: items } = await useAsyncData(
    () => api.request(readItems('cost_estimator', {
        filter: {
            plan_file: route.params?.file_id
        },
        limit: -1
    })),
    {
        transform: (response) => {
            console.log('response cost_estimator', response)
            let items = response?.items?.map((item) => ({
                ...item,
                type: 'item',
                expand: true,
            })) || []
            return arrayToTree(items, {parentId: 'parent', childrenField: 'children', dataField: null })
        },
    }
)

const rows = computed(() => groups.value?.map((group) => ({
    ...group,
    children: items.value?.filter((item) => item?.group === group?.name)
}) ))

</script>

<style lang="scss">

</style>