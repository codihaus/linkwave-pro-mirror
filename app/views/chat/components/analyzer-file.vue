<template>
    <div class="p-2 rounded-lg text-sm bg-dark-01 text-heading group" :class="{'cursor-pointer hover:outline hover:outline-primary': item?.analysis_id}">
        <div class="flex items-center gap-2">
            <i class="text-7 text-primary i-ant-design:file-pdf-outlined" />
            <div class="line-clamp-1">{{ item?.file_source?.filename_download }}</div>
        </div>
        <div class="mt-1 text-xs">
            <span v-if="item?.analysis_id">
                <span class="group-hover:hidden">Analyse Completed</span>
                <span class="hidden group-hover:block text-primary">Select this file to work</span>
            </span>
            <div v-else>
                {{ item?.time }}
                <n-progress
                    type="line"
                    :percentage="item?.percent || 90"
                    :show-indicator="false"
                    processing
                    color="#14E3AE"
                    :height="6"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        item: any
    }>(),
    {
        item: () => ({})
    }
)
</script>

<style lang="scss">

</style>