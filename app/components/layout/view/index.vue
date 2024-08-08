<template>
    <n-layout class="bg-neutral-07">
        <layout-header>
            <template v-if="$slots?.['header-right']" #header-right>
                <slot name="header-right"></slot>
            </template>
        </layout-header>
        <n-layout has-sider class="content-box">
            <layout-sidebar />
            <slot name="sub-navigation"></slot>
            <n-layout-content :native-scrollbar="false" ref="contentRef" content-class="lg:py-6">
                <div class="rounded-xl bg-hex-1A1D1E min-h-[calc(100dvh-121px)]">
                    <slot />
                </div>
            </n-layout-content>
            <div class="w-14">
                <slot name="right-sidebar"></slot>
            </div>
        </n-layout>
    </n-layout>
</template>

<script setup lang="ts">
const contentRef = useState('chatboxRef', () => null)
</script>

<style lang="scss">
.content-box {
    .n-layout-scroll-container {
        overflow: hidden;
        height: 100vh;
        height: 100dvh;
        display: flex;
        flex-direction: column;
    }
    .n-layout-content {
        height: calc(100vh - 73px);
        height: calc(100dvh - 73px);
    }
}
</style>