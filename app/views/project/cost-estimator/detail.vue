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
                
            </div>
            <div class="grid gap-5 lg:grid-cols-4 p-5 bg-hex-191B1B">
                <div class="p-3 rounded border border-neutral-01 border-opacity-10 bg-neutral-07">
                    <div class="text-white mb-3">PROPERTY OWNER</div>
                    <div class="text-neutral-03 text-opacity-75 leading-normal">
                        <div>{{project.client_name}}</div>
                    </div>
                </div>
                <div class="p-3 rounded border border-neutral-01 border-opacity-10 bg-neutral-07">
                    <div class="text-white mb-3">SCOPE OFWORK</div>
                    <div class="text-neutral-03 text-opacity-75 leading-normal">
                        <div>{{ project?.description }}</div>
                    </div>
                </div>
                <div class="p-3 rounded border border-neutral-01 border-opacity-10 bg-neutral-07">
                    <div class="text-white mb-3">REGIONAL</div>
                    <div class="text-neutral-03 text-opacity-75 leading-normal">
                        <div>{{ project?.address }}</div>
                        <div>{{ project?.location }}</div>
                    </div>
                </div>
                <div class="p-3 rounded border border-neutral-01 border-opacity-10 bg-neutral-07">
                    <div class="text-white mb-3">NAME OF FILE</div>
                    <div class="text-neutral-03 text-opacity-75 leading-normal">
                        <div>{{ file?.file?.filename_download }}</div>
                    </div>
                </div>
            </div>
            <div class="">
                <n-data-table
                    v-if="rows?.length"
                    :columns="columns"
                    :data="rows"
                    :single-line="false"
                    :row-class-name="rowClassName"
                    :default-expand-all="true"
                    :default-expanded-row-keys="defaultExpanded"
                    :expanded-row-keys="defaultExpanded"
                    :row-key="(row, index) => row.rowId"
                    :row-props="rowProps"
                    @update:checked-row-keys="handleCheck"
                    :cascade="false"
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
            </div>
            <div class="fixed inline-flex gap-2 left-1/2 bottom-4 transform -translate-x-1/2 rounded-lg bg-neutral-09 p-3">

                <n-button type="primary" ghost :disabled="savingEdit" :loading="savingEdit" @click="isEditMode=true">
                    <i class="i-custom-edit text-xl leading-0 mr-2"></i>
                    <span>{{ 'Edit Mode' }}</span>
                </n-button>
                <n-popover
                    trigger="click"
                    scrollable
                    style="max-height: 240px; --n-color: #343839;"
                >
                    <template #trigger>
                        <div>
                            <n-button v-if="isEditMode" type="primary" :disabled="savingEdit" :loading="savingEdit" @click="isEditMode=true">
                                <i class="i-custom-add text-xl leading-0 mr-2"></i>
                                <span>{{ 'Add row' }}</span>
                            </n-button>
                        </div>
                    </template>
                    <div>
                        <n-form-item label="Group" style="--n-label-text-color: #E8ECEF">
                            <n-select v-model:value="newRow.group" size="large"  :options="newRowGroupOptions" placeholder="Choose group" style="--n-border: 0" />
                        </n-form-item>
                        <n-form-item label="Parent" style="--n-label-text-color: #E8ECEF">
                            <n-select v-model:value="newRow.parent" size="large"  :options="newRowParentOptions" clearable placeholder="Choose parent" style="--n-border: 0" />
                        </n-form-item>
                        <n-form-item label="Name" style="--n-label-text-color: #E8ECEF">
                            <n-input v-model:value="newRow.name" size="large" placeholder="Enter name"></n-input>
                        </n-form-item>
                        <n-form-item label="Description" style="--n-label-text-color: #E8ECEF">
                            <n-input v-model:value="newRow.description" size="large" type="textarea" placeholder="Enter description"></n-input>
                        </n-form-item>
                        <n-form-item label="Unit" style="--n-label-text-color: #E8ECEF">
                            <n-input v-model:value="newRow.unit" size="large" :disabled="!newRow.parent" placeholder="Enter unit" class="disabled-number"/>
                        </n-form-item>
                        <n-form-item label="Quantity" style="--n-label-text-color: #E8ECEF">
                            <n-input-number v-model:value="newRow.quantity" size="large" :disabled="!newRow.parent" placeholder="Enter quantity" class="disabled-number"/>
                        </n-form-item>
                        <n-form-item label="Unit cost" style="--n-label-text-color: #E8ECEF">
                            <n-input-number v-model:value="newRow.cost_price" size="large" :disabled="!newRow.parent" placeholder="Enter unit cost" class="disabled-number"/>
                        </n-form-item>
                        <n-form-item label="Labor cost" style="--n-label-text-color: #E8ECEF">
                            <n-input-number v-model:value="newRow.selling_price" size="large" :disabled="!newRow.parent" placeholder="Enter labor cost" class="disabled-number"/>
                        </n-form-item>
                        <n-form-item label="Final price" style="--n-label-text-color: #E8ECEF">
                            <n-input :value="parseFloat((newRow.quantity * newRow.selling_price).toFixed(2))|| null" size="large" disabled placeholder="0" class="disabled-number" />
                        </n-form-item>
                        <n-form-item label="Note" style="--n-label-text-color: #E8ECEF">
                            <n-input v-model:value="newRow.note" size="large" type="textarea" placeholder="Enter note"></n-input>
                        </n-form-item>
                        <n-button
                            block
                            type="primary"
                            size="large"
                            :disabled="creating"
                            :loading="creating"
                            @click="createRow"
                        >Create row</n-button>
                    </div>
                </n-popover>
                <n-button v-if="isEditMode && ! savingEdit" type="error" :disabled="savingEdit" :loading="savingEdit" @click="deleteRows">
                    <span>{{ 'Delete selected rows' }}</span>
                </n-button>
                <n-button v-if="isEditMode && ! savingEdit" type="primary" :disabled="savingEdit" :loading="savingEdit" @click="saveRows">
                    <span>{{ 'Save' }}</span>
                </n-button>
            </div>
            <n-modal v-model:show="showMeasurement">
                <div class="container lg:px-0 my-10">
                    <div class="relative p-5 lg:p-6 bg-neutral-06 bg-opacity-90 rounded-xl">
                        <div class="absolute -top-3 -right-3">
                            <n-button type="error" icon text @click="showMeasurement = false">
                                <i class="i-custom-close text-2xl leading-0"></i>
                            </n-button>
                        </div>
                        <div class="flex items-center p-2 bg-neutral-09 rounded-lg gap-6">
                            <div class="flex items-center gap-2">
                                <div class="text-white">Actual Length:</div>
                                <div class="flex items-center gap-3 rounded">
                                    <!-- <div class="text-red-5 min-w-48 text-center">{{semiData.length}}</div> -->
                                    <n-input-number v-model:value="semiData.length" class="semi-data-lenght"></n-input-number>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="text-white">Unit:</div>
                                <div class="flex items-center gap-3 px-4 bg-neutral-07 rounded">
                                    <n-select v-model:value="semiData.unit" :options="unitOptions" disabled style="--n-border: 0" />
                                </div>
                            </div>
                            <n-button type="info" size="large" @click="startDraw()">
                                <i class="i-custom-ruler text-2xl leading-0 mr-2"></i>
                                {{ canDraw ? 'Stop Draw Line' : 'Draw Measurement Line' }}
                            </n-button>
                            <n-button
                                type="primary"
                                size="large"
                                class="ml-auto"
                                :disabled="saving"
                                :loading="saving"
                                @click="onSaveSemiData"
                            >Save</n-button>
                        </div>
                        <div class="rounded-lg mt-4 text-center">
                            <div class="relative inline-block">
                                <canvas ref="drawer" id="drawer" class="absolute w-full h-full inset-0" :class="{'cursor-crosshair': canDraw, 'pointer-events-none': ! canDraw}" ></canvas>
                                <img ref="drawerImage" :src="getCMSUrl(`assets/${file?.file?.id}`)" class="">
                            </div>
                        </div>
                    </div>
                </div>
            </n-modal>
            <n-modal
                v-model:show="showEditLength"
                :mask-closable="false"
            >
                <div class="my-10 w-75">
                    <div class="relative p-5 lg:p-6 bg-neutral-06 bg-opacity-90 rounded-xl">
                        <n-form-item label="Actual Length:">
                            <n-input-number v-model:value="semiData.length" size="large" class="semi-data-lenght w-full"></n-input-number>
                        </n-form-item>
                        <n-form-item label="Unit:">
                            <n-select v-model:value="semiData.unit"  size="large"  :options="unitOptions" disabled style="--n-border: 0" />
                        </n-form-item>
                        <div class="mt-4">
                            <n-button type="primary" size="large" block @click="showEditLength = false">Set Length</n-button>
                        </div>
                    </div>
                </div>
            </n-modal>
        </div>
    </layout-view>
</template>
<script setup lang="ts">
import { createItem, customEndpoint, deleteItems, readItem, readItems, updateItem } from '@directus/sdk';
import LazyRightSidebar from '../components/right-sidebar.vue'
import SubNavigation from '../components/sub-navigation.vue'
import EditCell from './edit-cell.vue'
import { NInput, NTag } from 'naive-ui';
import millify from 'millify'
import { arrayToTree } from 'performant-array-to-tree';
import { isEqual, set } from 'lodash-es';

definePageMeta({
	auth: true,
    sidebarCollapsed: true,
    hideSidebar: true
})

const api = useNAD()
const route = useRoute()
const notify = useNaiveNotification()

function goBack() {
    return {
        name: 'project-cost-estimator',
        params: {
            id: route.params?.id
        }
    }
}

const currentUser = useState('currentUser')

const { data: project } = await useProject()
const { getCMSUrl } = useCMSUrl()

const constructionFile = project.value.files?.find((f) => f.type === 'construction')?.id || null

console.log('constructionFile', constructionFile)

const isEditMode = ref(false)
const editItems = ref({})

const columns = computed(() => {
    let output = [
        
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
            render: (rowData) => {
                if( ['subtotal', 'discount', 'grand_total'].includes(rowData?.type) ) {
                    return rowData?.name
                }
                return h(EditCell, {
                    editAble: isEditMode.value,
                    value: rowData?.name,
                    onUpdateValue(v) {
                        items.value[rowData.index].name = v
                        editItems.value[rowData.id] = items.value[rowData.index]
                    }
                })
            }
        },
        {
            title: 'Description',
            key: 'description',
            render: (rowData) => h(EditCell, {
                editAble: isEditMode.value,
                value: rowData?.description,
                inputType: 'textarea',
                onUpdateValue(v) {
                    items.value[rowData.index].description = v
                    editItems.value[rowData.id] = items.value[rowData.index]
                }
            })
        },
        {
            title: 'Unit',
            key: 'unit',
            width: 80,
            render: (rowData, rowIndex) => {
                if( rowData?.type === 'item' && !rowData?.parent ) {
                    return ''
                }
                return h(EditCell, {
                    editAble: isEditMode.value,
                    value: rowData?.unit,
                    onUpdateValue(v) {
                        items.value[rowData.index].unit = v
                        editItems.value[rowData.id] = items.value[rowData.index]
                    }
                })
            }
        },
        {
            title: 'Quantity',
            key: 'quantity',
            width: 140,
            render: (rowData) => {
                if( rowData?.type === 'item' && !rowData?.parent ) {
                    return ''
                }
                return h(EditCell, {
                    editAble: isEditMode.value,
                    value: rowData?.quantity,
                    inputType: 'number',
                    onUpdateValue(v) {
                        items.value[rowData.index].quantity = v
                        items.value[rowData.index].final_price = parseFloat((v * items.value[rowData.index].selling_price).toFixed(2))
                        editItems.value[rowData.id] = items.value[rowData.index]
                    }
                })
            }
        },
        {
            title: 'Unit cost ($)',
            key: 'cost_price',
            width: 140,
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
                return h(EditCell, {
                    editAble: isEditMode.value,
                    value: rowData?.cost_price,
                    inputType: 'number',
                    onUpdateValue(v) {
                        items.value[rowData.index].cost_price = v
                        editItems.value[rowData.id] = items.value[rowData.index]
                    }
                })
                return parsePrice(rowData?.cost_price)
            }
        },
        {
            title: 'Labor cost ($)',
            key: 'selling_price',
            width: 140,
            render: (rowData) => h(EditCell, {
                editAble: isEditMode.value,
                value: rowData?.selling_price,
                inputType: 'number',
                onUpdateValue(v) {
                    items.value[rowData.index].selling_price = v
                    items.value[rowData.index].final_price = parseFloat((v * items.value[rowData.index].quantity).toFixed(2))
                    editItems.value[rowData.id] = items.value[rowData.index]
                }
            })
        },
        {
            title: 'Final price($)',
            key: 'final_price',
            width: 140,
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
            width: 220,
            render: (rowData) => h(EditCell, {
                editAble: isEditMode.value,
                value: rowData?.note,
                inputType: 'textarea',
                showAddButton: isEditMode.value,
                onUpdateValue(v) {
                    items.value[rowData.index].note = v
                    editItems.value[rowData.id] = items.value[rowData.index]
                },
                onAdd() {
                    createRow(rowData)
                }
            })
        },
    ]

    if( isEditMode.value ) {
        output.unshift({
            title: '',
            type: 'selection',
            disabled(row) {
                return row.type !== 'item'
            }
        })
    } else {
        output.filter((col) => col?.type !== 'selection')
    }

    return output
})

function rowClassName(rowData, index) {
    if( rowData.type === 'group' ) {
        return 'estimator-group relative bg-dark-05 font-bold text-base group'
    }
    if( rowData?.type === 'item' ) {
        return  !rowData?.parent ? 'estimator-item-parent relative font-bold bg-neutral-04 bg-opacity-20 group' : 'estimator-item group'
    }

    if( ['subtotal', 'discount', 'grand_total'].includes(rowData?.type) ) {
        return 'bg-dark-05 font-bold text-base group'
    }
}

function rowProps(row) {
    return {
        style: 'cursor: pointer;',
        onClick: () => {
            
        }
    }
}

const checkedRowKeys = ref([])

function handleCheck(rowKeys) {
    checkedRowKeys.value = rowKeys
    console.log('checkedRowKeys', checkedRowKeys.value)
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

const expandedRows = ref([])

const page = ref(1)
const limit = ref(20)

const { data: groups, pending, refresh } = await useAsyncData(
    () => api.request(readItems('estimator_group', {
        limit: -1
    })),
    {
        transform: (response) => {
            console.log('response', response)
            return response?.items?.map((item) => {
                return {
                    ...item,
                    type: 'group',
                    expand: true,
                    rowId: `group-${item.name}`,
                    children: []
                }
            }).filter((item) => item?.cost_estimator?.length > 0)
        },
    }
)

const { data: items, refresh: refreshCostEstimator } = await useAsyncData(
    () => api.request(readItems('cost_estimator', {
        filter: {
            plan_file: constructionFile
        },
        limit: -1
    })),
    {
        transform: (response) => {
            console.log('response cost_estimator', response)
            let items = response?.items?.map((item, index) => {
                return {
                    ...item,
                    type: 'item',
                    expand: true,
                    rowId: `item-${item.id}`,
                    index
                }
            }) || []
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
    ...groups.value?.map((group) => {
        return {
            ...group,
            children: treeItems.value?.filter((item) => item?.group === group?.name)?.map((item, index) => ({...item}))
        }
    }),
    {
        type: 'subtotal',
        rowId: 'subtotal',
        cost_price: 'SUBTOTAL',
        final_price: subTotalPrice.value
    },
    {
        type: 'discount',
        rowId: 'discount',
        cost_price: 'Discount',
        final_price: 0
    },
    {
        type: 'grand_total',
        rowId: 'grand_total',
        cost_price: 'GRAND TOTAL',
        final_price: subTotalPrice.value
    },
].filter(({children, type}) => {
    if( type === 'group' && !children?.length ) {
        return false
    }
    return true
}) ))

const defaultExpanded = computed(() => ([
    ...groups.value?.map((item) => item?.rowId),
    ...items.value?.filter((item) => !item?.parent)?.map((item) => item?.rowId)
]))

const savingEdit = ref(false)

const newRowGroupOptions = computed(() => groups.value?.map((group) => ({
    value: group.name,
    label: group.name,
})))

const newRowParentOptions = computed(() => items.value?.filter((item) => !item.parent)?.map((item) => ({
    value: item.id,
    label: item.name,
})))

const newRow = ref({
    group: newRowGroupOptions.value?.[0]?.value,
    plan_file: constructionFile,
    name: '',
    description: '',
    note: '',
    unit: null,
    quantity: null,
    cost_price: null,
    selling_price: null,
    final_price: null,
    parent: null
})

const creating = ref(false)

async function createRow() {
    savingEdit.value = true

    if( newRow.value.parent ) {
        newRow.value.final_price = parseFloat((newRow.value.quantity * newRow.value.selling_price || 0).toFixed(2))
    }

    await api.request(createItem('cost_estimator', newRow.value)).then((response) => {

        newRow.value.parent = null
        newRow.value.name = ''
        newRow.value.description = ''
        newRow.value.note = ''
        newRow.value.unit = null
        newRow.value.quantity = null
        newRow.value.cost_price = null
        newRow.value.selling_price = null
        newRow.value.final_price = null
        refreshCostEstimator()
        notify.create({
            type: 'success',
            title: 'Created row successfully!',
            description: `Row ${newRow.value?.name} has been created successfully!`,
            duration: 3000
        })
    }).catch(() => {
        notify.create({
            type: 'error',
            title: 'Creating row failed!',
            description: `Row ${newRow.value?.name}. Please try again!`,
            duration: 3000
        })
        savingEdit.value = false
    })
    savingEdit.value = false
}

async function deleteRows() {
    savingEdit.value = true
    let keys = checkedRowKeys.value?.map((key) => Number(key?.replace('item-', '') ))
    await api.request(deleteItems('cost_estimator', keys)).then(async () => {
        checkedRowKeys.value = []
        notify.create({
            type: 'success',
            title: 'Successfully!',
            description: 'Estimator data has been updated successfully!',
            duration: 4000
        })
        await refreshCostEstimator()
    }).catch(() => {
        savingEdit.value = false
        notify.create({
            type: 'error',
            title: 'Deleting row failed!',
            description: `Please try again!`,
            duration: 3000
        })
    })
    savingEdit.value = false
}

async function saveRows() {
    console.log('editItems', editItems.value)

    
    savingEdit.value = true
    
    let itemsToSave = Object.values(editItems.value)
    
    if( itemsToSave?.length < 1 ) {
        isEditMode.value = false
        savingEdit.value = false
        return
    }

    for await (const item of itemsToSave) {

        let data = {
            name: item?.name,
            description: item?.description,
            note: item?.note,
            quantity: item?.quantity,
            unit: item?.unit,
            cost_price: item?.cost_price,
            selling_price: item?.selling_price,
            final_price: item?.final_price,
            parent: item?.parent
        }
        if( item?.type === 'item' ) {
            await api.request(
                !item?.id ? createItem('cost_estimator', data) : updateItem('cost_estimator', item?.id, data)
            )
        }
    }

    notify.create({
        type: 'success',
        title: 'Successfully!',
        description: 'Estimator data has been updated successfully!',
        duration: 4000
    })
    editItems.value = {}
    savingEdit.value = false
    isEditMode.value = false
}



const showMeasurement = ref(false)
const pixelLength = ref(0)
const measurementUnit = ref('inches')
const unitOptions = ref([
    {
        label: 'Inch',
        value: 'inches'
    }
])

const {
    points,
    canDraw,
    showEditLength,
    showEditLengthPoint,
    drawer,
    drawerImage,
    semiData,
    startDraw,
    drawSavedPoints,
    drawLine
} = useDrawer()


function useDrawer() {
    
    const canDraw = ref(false)
    const showEditLength = ref(false)
    const showEditLengthPoint = ref({x: 0, y: 0})
    const drawer = ref()
    const drawerImage = ref()
    const semiData = ref({
        unit: "inches",
        length: 0,
        points: [[],[]],
        displayPoints: []
    })

    const points = ref([])
    const isDrawing = ref<boolean>(false);
    const isVertical = ref<boolean | null>(null);

    function startDraw(force = false) {

        canDraw.value = ! canDraw.value

        if( force ) {
            canDraw.value = true
        }

        if(!canDraw.value) return


        drawer.value.width = drawerImage.value.width
        drawer.value.height = drawerImage.value.height

        drawer.value?.removeEventListener('mousedown', drawPoint)
        drawer.value?.addEventListener('mousedown', drawPoint)

        drawer.value?.removeEventListener('mousemove', drawOnMove)
        drawer.value?.addEventListener('mousemove', drawOnMove)
    }

    function drawPoint(event) {
        // Get the starting point
        const rect = drawer.value?.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        points.value.push({ x, y });
        let clickedPoint = {
            x: isVertical.value ? points.value?.[0]?.x : x,
            y: !isVertical.value ? points.value?.[0]?.y : y
        }
        isDrawing.value = true;
        if (points.value?.length === 2) {
            set(points.value, '1', clickedPoint)
            console.log('canvas click', points.value)
            showEditLength.value = true
            showEditLengthPoint.value = clickedPoint
            isDrawing.value = false;
            setSemiData(points.value)
            points.value = [];
        }
    }

    function drawOnMove(event) {
        if (!isDrawing.value) return;
        
        const context = drawer.value?.getContext('2d');
        
        // Get the current mouse position
        const rect = drawer.value?.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Clear the canvas (if you want to only show the current line)
        context.clearRect(0, 0, drawer.value?.width, drawer.value?.height);
        
        console.log('canvas move', points.value?.[0], { x, y })
        // Draw the line following the mouse position
        drawLine(points.value?.[0], { x, y });
    }


    function drawSavedPoints() {
        const context = drawer.value?.getContext('2d');
        
        // drawer.value.width = drawerImage.value.width
        // drawer.value.height = drawerImage.value.height
        console.log('drawSavedPoints', semiData.value.displayPoints)
        if( semiData.value.displayPoints?.length > 1 ) {
            startDraw(true)
            canDraw.value = false

            context.clearRect(0, 0, drawer.value?.width, drawer.value?.height);
            drawLine(semiData.value.displayPoints?.[0], semiData.value.displayPoints?.[1]);
        }
    }

    function drawLine(point1, point2) {
        const context = drawer.value?.getContext('2d');
        context.beginPath();

        if (Math.abs(point1.x - point2.x) > Math.abs(point1.y - point2.y)) {
        // Draw a horizontal line
            context.moveTo(point1.x, point1.y);
            context.lineTo(point2.x, point1.y); // Horizontal line at y of point1
            isVertical.value = false
        } else {
        // Draw a vertical line
            context.moveTo(point1.x, point1.y);
            context.lineTo(point1.x, point2.y); // Vertical line at x of point1
            isVertical.value = true
        }

        context.strokeStyle = 'red'; // Set the color of the line
        context.lineWidth = 10; // Set the width of the line
        context.stroke(); // Draw the line
        console.log('drawLine', point1, point2)
    }

    function setSemiData(points = []) {
        let ratio = drawerImage.value.naturalWidth / drawerImage.value.width

        let calculatedPoints = points?.map((p) => ({
            x: ratio * p.x,
            y: ratio * p.y,
        }))

        console.log('calculatedPoints', calculatedPoints)

        semiData.value.points = calculatedPoints?.map((p) => ([
            p?.x,
            p?.y
        ]))

        semiData.value.displayPoints = points
    }

    return {
        canDraw,
        showEditLength,
        showEditLengthPoint,
        drawer,
        drawerImage,
        semiData,
        startDraw,
        drawSavedPoints,
        drawLine
    }
}


watch([showMeasurement, drawerImage], () => {
    console.log('drawerImage.value', drawerImage.value?.height)
    if( showMeasurement.value ) {
        drawerImage.value?.addEventListener('load', drawSavedPoints)
        
    } else {
        drawerImage.value?.removeEventListener('load', drawSavedPoints)
    }
})

const { data: file } = await useAsyncData(
    () => api.request(readItem('files', route.params?.file_id, {
        fields: ['id', 'semi_data', 'file.filename_download', 'file.id']
    })),
)

if( file.value?.semi_data ) {
    semiData.value = file.value?.semi_data
    console.log('semiData', semiData.value)
}


const { pending: saving, refresh: saveSemiData } = await useAsyncData(
    () => semiData.value.length > 0 ? api.request(updateItem('files', route.params?.file_id,{
        semi_data: semiData.value,
        status: 'recalculating'
    })) : {}
)

async function onSaveSemiData() {
    try {
        await saveSemiData()
        await api.request(customEndpoint({
            method: 'POST',
            path: `/project/${route.params?.id}/cost-estimator/update-semi/${route.params?.file_id}`,
        }))

        notify.create({
            type: 'success',
            title: 'Successfully',
            description: 'Processing calculation!',
            duration: 3000
        })
    } catch(e) {
        notify.create({
            type: 'error',
            title: 'Failed',
            description: 'Please try again!',
            duration: 3000
        })
        console.log('save semi data error', e)
    }
}

const { socket } = await useSocket()


async function subscribe() {
    const { subscription } = await socket?.value?.subscribe('cost_estimator', {
        query: {
            filter: {
                plan_file: constructionFile
            },
            fields: [ 'id', 'user_updated', 'date_updated' ],
        },
    });

    console.log('subscription', subscription)

    for await (const sub of subscription) {

        if( sub?.event === 'init' ) {
            console.log('subscribe item', sub);
        }

    }   
}

onMounted(async () => {

    let lastMessage = null

    socket.value?.onWebSocket('message', function (socketMessage: any) {
        const { type, data, event } = socketMessage;
        console.log('message', type)
        if (event === 'create') {
            // floorFiles.value.unshift(data?.[0])
        }

        if (socketMessage.type === 'ping') {
            socket.value?.sendMessage({
                type: 'pong',
            });
        }
        
        if (event === 'update') {
            if( isEqual(lastMessage, socketMessage) ) {
                return
            }
            if( ! lastMessage ) {
                lastMessage = socketMessage
            }


            console.log('updated item', socketMessage)
            let semiAutoUpdated = data?.find((item) => item?.user_updated !== currentUser.value.id)
            if( semiAutoUpdated ) {
                notify.create({
                    type: 'info',
                    title: 'Recalculating successfully!',
                    description: `Cost estimator has been recalculated. Please check!`
                })
                refreshCostEstimator()
                api.request(updateItem('files', route.params?.file_id,{
                    status: 'completed'
                }))
            }
        }
    });

    socket.value.onWebSocket('close', function () {
        console.log({ event: 'onclose' });
    });

    await subscribe()

})
</script>

<style lang="scss">
[data-col-key="no"][style^="--indent-offset: 2"] {
    border-bottom-color: transparent !important;
}
[data-col-key="no"][style^="--indent-offset: 1"] {
    border-top: 1px solid var(--n-merged-border-color) !important;
}
.n-data-table-td {
    position: relative;
}
.semi-data-lenght {
    .n-input {
        --n-color: #343839;
        --n-height: 45px;
    }
}

.disabled-number {
    &.n-input {
        --n-color-disabled: #232627;
        --n-border-disabled: 1px solid #232627;
    }
    .n-input{
        --n-color-disabled: #232627;
        --n-border-disabled: 1px solid #232627;
    }
}
</style>