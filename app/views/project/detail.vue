<template>
    <layout-view>
        <template #header-right>
            <n-button type="primary" icon class="px-2" style="--n-height: 40px;" @click="navigateTo('/project')">
                <i class="i-custom-plus text-2xl leading-0"></i>
            </n-button>
        </template>
        <template #right-sidebar>
            <lazy-right-sidebar />
        </template>
    </layout-view>
</template>

<script setup lang="ts">


definePageMeta({
	auth: true,
    sidebarCollapsed: true
})

</script>

<style lang="scss">

</style>