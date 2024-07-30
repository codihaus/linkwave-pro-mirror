<template>
    <div class="gradient-corner p-0.5 rounded-20px">
        <div class="rounded-18px" :class="wrapperClass">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        wrapperClass: string | Array | Object
    }>(),
    {
        wrapperClass: ''
    }
)

</script>

<style lang="scss">

</style>