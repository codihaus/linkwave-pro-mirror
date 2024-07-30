<template>
    <div class="flex gap-2.5">
        <component
            :is="item?.upload ? 'div' : 'a'"
            v-for="item in items"
            class="px-4 py-2 flex items-center gap-3 rounded-lg hover:outline hover:outline-primary"
            :class="item?.upload ? 'bg-dark-03' : 'bg-dark-01'"
            :href="item?.url"
            :download="item?.name"
        >
            <i class="text-7 text-primary" :class="getIcon(item?.type)" />
            <div>
                <div class="text-sm text-heading">
                    <span v-if="item?.name">{{ item?.name }}</span>
                    <n-skeleton v-else text round height="6" class="text-sm min-w-20" style="--n-color-start: #323C61; --n-color-end: #16203E;"/>
                </div>
                <div class="text-xs text-content mt-1">{{ item?.size ? getSize(item?.size) : '...' }}</div>
                <div v-if="Number(item?.percentage) < 100">
                    <n-progress
                        
                        type="line"
                        :percentage="item?.percentage"
                        :indicator-placement="'inside'"
                        :height="2"
                        :show-indicator="false"
                        style="--n-text-color-line-inner: transparent"
                    />
                </div>
            </div>
            <i
                class="text-xl text-content-02 ml-auto cursor-pointer"
                :class="item?.upload ? 'i-ant-design:close-outlined hover:text-red' : 'i-ant-design:download-outlined hover:text-white'"
                @click="emit('delete', item)"
            ></i>
        </component>
    </div>
</template>

<script setup lang="ts">
import millify from "millify";

withDefaults(
    defineProps<{
        items: any
    }>(),
    {
        items: () => []
    }
)

const emit = defineEmits(['delete'])

function getIcon(type: string = 'pdf') {
    if( type === 'json' ) {
        return `i-lucide:file-json`
    }
    return `i-ant-design:file-pdf-outlined`
}

function getSize(size) {
    return millify(size, {
        units: ["B", "KB", "MB", "GB", "TB"],
        space: true,
    })
}

</script>

<style lang="scss">

</style>