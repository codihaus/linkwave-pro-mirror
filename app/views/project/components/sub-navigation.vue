<template>
    <div class="flex items-center gap-2 text-white">
        <nuxt-link to="/projects" class="leading-0"><i class="i-custom-arrow-narrow-left text-xl"></i></nuxt-link>
        <span>{{ project?.name }}</span>
    </div>
    <div class="mt-4">
        <nuxt-link v-for="item in items" :to="item?.to" class="menu-item py-3 px-5 flex items-center rounded hover:text-primary" :class="{'pointer-events-none opacity-70 cursor-not-allowed': item?.to?.startsWith('#')}" :active-class="item?.to?.startsWith('#') ? '' : 'active'">
            <i class="text-2xl leading-0 flex-shrink-0" :class="item?.icon"></i>
            <span class="ml-5">{{ item?.label }}</span>
        </nuxt-link>
    </div>
</template>

<script setup lang="ts">

const { data: project } = await useProject()

const items = computed(() => [
    {
        label: 'AI Assistant',
        to: '#',
        icon: 'i-custom-project-ai',
        disabled: true
    },
    {
        label: 'Cost Estimator',
        to: `/project/${project.value?.id}/cost-estimator`,
        icon: 'i-custom-project-estimator',
        disabled: false
    },
    {
        label: 'Task Manager',
        to: '#',
        icon: 'i-custom-project-task-manager',
        disabled: true
    },
    {
        label: 'Files Manager',
        to: '#',
        icon: 'i-custom-project-file-manager',
        disabled: true
    },
    {
        label: 'Members',
        to: '#',
        icon: 'i-custom-project-member',
        disabled: true
    },
    {
        label: 'Settings',
        to: '#',
        icon: 'i-custom-settings',
        disabled: true
    },
])
</script>

<style scoped>

</style>