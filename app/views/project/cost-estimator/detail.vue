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
                    <div class="container lg:px-0 my-10">
                        <div class="relative p-5 lg:p-6 bg-neutral-06 bg-opacity-90 rounded-xl">
                            <div class="absolute -top-3 -right-3">
                                <n-button type="error" icon text @click="showMeasurement = false">
                                    <i class="i-custom-close text-2xl leading-0"></i>
                                </n-button>
                            </div>
                            <div class="flex items-center p-2 bg-neutral-09 rounded-lg gap-6">
                                <div class="flex items-center gap-2">
                                    <div class="text-white">Detected Length:</div>
                                    <div class="flex items-center gap-3 px-4 bg-neutral-05 rounded">
                                        <div class="text-red-5 min-w-48 text-center">{{semiData.length}}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="text-white">Unit:</div>
                                    <div class="flex items-center gap-3 px-4 bg-neutral-07 rounded">
                                        <n-select v-model:value="semiData.unit" :options="unitOptions" disabled style="--n-border: 0" />
                                    </div>
                                </div>
                                <n-button type="info" size="large" @click="startDraw">
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
            </div>
            <div class="hidden fixed xinline-flex gap-2 left-1/2 bottom-4 transform -translate-x-1/2 rounded-lg bg-neutral-09 p-3">

                <n-button type="primary" ghost :disabled="savingEdit" :loading="savingEdit" @click="isEditMode=true">
                    <i class="i-custom-edit text-xl leading-0 mr-2"></i>
                    <span>{{ 'Edit Mode' }}</span>
                </n-button>
                <n-button v-if="isEditMode" type="primary" :disabled="savingEdit" :loading="savingEdit" @click="isEditMode=true">
                    <i class="i-custom-add text-xl leading-0 mr-2"></i>
                    <span>{{ 'Add row' }}</span>
                </n-button>
                <n-button v-if="isEditMode" type="primary" :disabled="savingEdit" :loading="savingEdit" @click="saveRows">
                    <span>{{ 'Save' }}</span>
                </n-button>
            </div>
        </div>
        <pre>{{file}}</pre>
    </layout-view>
</template>
<script setup lang="ts">
import { createItem, customEndpoint, readItem, readItems, updateItem } from '@directus/sdk';
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
const notify = useNaiveNotification()

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

const constructionFile = project.value.files?.find((f) => f.type === 'construction')?.id || null

const isEditMode = ref(false)
const editItems = ref({})

const columns = computed(() => [
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
            return rowData?.unit
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
            onUpdateValue(v) {
                items.value[rowData.index].note = v
                editItems.value[rowData.id] = items.value[rowData.index]
            }
        })
    },
])

function rowClassName(rowData, index) {
    if( rowData.type === 'group' ) {
        return 'estimator-group relative bg-dark-05 font-bold text-base'
    }
    if( rowData?.type === 'item' ) {
        return  !rowData?.parent ? 'estimator-item-parent relative font-bold bg-neutral-04 bg-opacity-20' : 'estimator-item'
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
            plan_file: constructionFile
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

const savingEdit = ref(false)
async function saveRows() {
    console.log('editItems', editItems.value)
    savingEdit.value = true

    let itemsToSave = Object.values(editItems.value)
    try {

    } catch(e) {

    } finally {

    }

    itemsToSave?.map(async (item) => {
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
    })
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
    canDraw,
    drawer,
    drawerImage,
    semiData,
    startDraw,
    drawSavedPoints,
    drawLine
} = useDrawer()


function useDrawer() {
    
    const canDraw = ref(false)
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
        console.log('canvas click')
        // Get the starting point
        const rect = drawer.value?.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        points.value.push({ x, y });
        isDrawing.value = true;
        if (points.value?.length === 2) {
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
        let ratioX = drawerImage.value.naturalWidth / drawerImage.value.width
        let ratioY = drawerImage.value.naturalHeight / drawerImage.value.height

        let calculatedPoints = points?.map((p) => ({
            x: ratioX * p.x,
            y: ratioY * p.y,
        }))
        semiData.value.points = calculatedPoints?.map((p) => ([
            p?.x,
            p?.y
        ]))

        semiData.value.displayPoints = points
        
        semiData.value.length = isVertical === true ? Math.abs(calculatedPoints[0].y - calculatedPoints[1].y) : Math.abs(calculatedPoints[0].x - calculatedPoints[1].x)
    }

    return {
        canDraw,
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
        semi_data: semiData.value
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
</script>

<style lang="scss">
[data-col-key="no"][style^="--indent-offset: 2"] {
    border-bottom-color: transparent !important;
}
[data-col-key="no"][style^="--indent-offset: 1"] {
    border-top: 1px solid var(--n-merged-border-color) !important;
}
</style>