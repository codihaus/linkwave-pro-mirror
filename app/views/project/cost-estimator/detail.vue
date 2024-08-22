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
                <div class="ml-auto text-neutral-01">GRAND TOTAL: {{ parsePrice(subTotalPrice) }}$</div>
                <n-button type="primary" @click="showMeasurement=true">
                    <i class="i-custom-ruler text-2xl leading-0 mr-2"></i>
                    Measurement ratio
                </n-button>
                <n-modal v-model:show="showMeasurement">
                    <div class="container">
                        <div class="p-5 lg:p-6 bg-neutral-06 bg-opacity-90 rounded-xl">
                            <div class="flex items-center p-2 bg-neutral-09 rounded-lg gap-6">
                                <n-button type="info" size="large">
                                    <i class="i-custom-ruler text-2xl leading-0 mr-2"></i>
                                    Set Scale by Measurement Line
                                </n-button>
                                <div class="flex items-center gap-2">
                                    <div class="text-white">Detected PixelLength:</div>
                                    <div class="flex items-center gap-3 px-4 bg-neutral-07 rounded">
                                        <div class="text-neutral-01">{{pixelLength}}</div>
                                        <n-select v-model:value="measurementUnit" :options="unitOptions" disabled style="--n-border: 0" />
                                    </div>
                                </div>
                                <n-button type="primary" size="large" class="ml-auto">Save</n-button>
                            </div>
                            <div class="rounded-lg mt-4">
                                <img :src="getCMSUrl(`assets/${file?.file}`)" alt="">
                            </div>
                        </div>
                    </div>
                </n-modal>
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
                    default-expand-all
                    :single-line="false"
                    :row-class-name="rowClassName"
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
import { readItem, readItems } from '@directus/sdk';
import LazyRightSidebar from '../components/right-sidebar.vue'
import SubNavigation from '../components/sub-navigation.vue'
import EditCell from './edit-cell.vue'
import { NInput, NTag } from 'naive-ui';
import millify from 'millify'
import { arrayToTree } from 'performant-array-to-tree';

definePageMeta({
	auth: true,
    sidebarCollapsed: true,
    hideSidebar: true
})

const api = useNAD()
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
const { getCMSUrl } = useCMSUrl()

const { data: file } = await useAsyncData(
    () => api.request(readItem('files', route.params?.file_id))
)

const columns = [
    {
        title: '',
        key: 'no',
        // width: '30%',
        render: (rowData, rowIndex) => {
            if(rowData?.type === 'group' ) {
                return rowData?.name
            }
        },
        colSpan: (rowData, rowIndex) => {
            let colSpan = 1
            if(rowData?.type === 'group') {
                colSpan = 7
            }

            // if( rowData?.type === 'item' && !rowData?.parent ) {
            //     colSpan = 6
            // }

            // if( ['subtotal', 'discount', 'grand_total'].includes(rowData?.type) ) {
            //     colSpan = 4
            // }

            return colSpan
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

            if( rowData?.type === 'item' && !rowData?.parent ) {
                colSpan = 6
            }

            if( ['subtotal', 'discount', 'grand_total'].includes(rowData?.type) ) {
                colSpan = 4
            }

            return colSpan
        },
        render: (rowData, rowIndex) => {
            if( rowData?.type === 'item'  ) {}
            return rowData?.name
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
        render: (rowData, rowIndex) => {
            if( rowData?.type === 'item' && !rowData?.parent ) {
                return ''
            }
            return rowData?.unit
        }
    },
    {
        title: 'Quantity',
        key: 'quantity',
        width: 120,
        render: (rowData) => {
            if( rowData?.type === 'item' && !rowData?.parent ) {
                return ''
            }
            return h(EditCell, {
                value: rowData?.quantity,
                onUpdateValue(v) {
                    items.value[rowData.index].quantity = v
                }
            })
            return  parsePrice(rowData?.quantity)
        }
    },
    {
        title: 'Unit cost ($)',
        key: 'cost_price',
        width: 120,
        colSpan: (rowData, rowIndex) => {
            let colSpan = 1
            if( ['subtotal', 'discount', 'grand_total'].includes(rowData?.type) ) {
                colSpan = 2
            }

            return colSpan
        },
        render: (rowData, rowIndex) => {
            if( ['subtotal', 'discount', 'grand_total'].includes(rowData?.type) ) {
                return h(
                    'span',
                    {
                        class: 'font-bold'
                    },
                    rowData?.cost_price
                )
            }
            return parsePrice(rowData?.cost_price)
        }
    },
    {
        title: 'Labor cost ($)',
        key: 'selling_price',
        width: 140,
        render: (rowData) => parsePrice(rowData?.selling_price)
    },
    {
        title: 'Final price($)',
        key: 'final_price',
        width: 120,
        colSpan: (rowData, rowIndex) => {
            let colSpan = 1
            if( ['subtotal', 'discount', 'grand_total'].includes(rowData?.type) ) {
                colSpan = 2
            }

            return colSpan
        },
        render: (rowData) => parsePrice(rowData?.final_price)
    },
    {
        title: 'Note',
        key: 'note',
        width: 220
    },
]

function rowClassName(rowData, index) {
    if( rowData.type === 'group' ) {
        return 'estimator-group bg-dark-05 font-bold text-base'
    }
    if( rowData?.type === 'item' ) {
        return  !rowData?.parent ? 'estimator-item-parent font-bold bg-neutral-04 bg-opacity-20' : 'estimator-item'
    }

    if( ['subtotal', 'discount', 'grand_total'].includes(rowData?.type) ) {
        return 'bg-dark-05 font-bold text-base'
    }
}

function summary(pageData) {
    return {
        name: {
        value: h(
            'span',
            { style: { color: 'red' } },
            pageData?.reduce(
                (prevValue, row) => Number(prevValue) + Number(row.final_price || 0),
                0
            )
        ),
            colSpan: 3
        }
    }
}

const page = ref(1)
const limit = ref(20)

const { data: groups, pending, refresh } = await useAsyncData(
    () => api.request(readItems('estimator_group', {
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
            })).filter((item) => item?.cost_estimator?.length > 0)
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
            let items = response?.items?.map((item, index) => ({
                ...item,
                type: 'item',
                expand: true,
                index
            })) || []
            return items
        },
    }
)

const treeItems = computed(() => arrayToTree(items.value, {parentId: 'parent', childrenField: 'children', dataField: null }))

const subTotalPrice = computed(() => items.value?.reduce(
    (prevValue, row) => {
        let output = prevValue + Number(row?.final_price || 0)
        return parseFloat(output?.toFixed(2))
    },
    0
))

const rows = computed(() => ([
    ...groups.value?.map((group) => ({
        ...group,
        children: treeItems.value?.filter((item) => item?.group === group?.name)?.map((item, index) => ({...item}))
    })),
    {
        type: 'subtotal',
        cost_price: 'SUBTOTAL',
        final_price: subTotalPrice.value
    },
    {
        type: 'discount',
        cost_price: 'Discount',
        final_price: 0
    },
    {
        type: 'grand_total',
        cost_price: 'GRAND TOTAL',
        final_price: subTotalPrice.value
    },
].filter(({children, type}) => {
    if( type === 'group' && !children?.length ) {
        return false
    }
    return true
}) ))

const showMeasurement = ref(false)
const pixelLength = ref(0)
const measurementUnit = ref('inch')
const unitOptions = ref([
    {
        label: 'Inch/mm',
        value: 'inch/mm'
    }
])


</script>

<style lang="scss">
[data-col-key="no"][style^="--indent-offset: 2"] {
    border-bottom-color: transparent !important;
}
[data-col-key="no"][style^="--indent-offset: 1"] {
    border-top: 1px solid var(--n-merged-border-color) !important;
}
</style>