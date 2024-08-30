<template>
    <n-layout class="bg-neutral-07">
        <layout-header>
            <template v-if="$slots?.['header-right']" #header-right>
                <slot name="header-right"></slot>
            </template>
        </layout-header>
        <n-layout has-sider class="content-box">
            <layout-sidebar :has-sub-navigation="!!$slots?.['sub-navigation']" />
            <div v-if="$slots?.['sub-navigation']" class="w-62 h-full py-6 flex-shrink-0 absolute z-99 left-17 top-0 bg-dark-05 lg:relative lg:left-0 lg:bg-transparent lt-lg:transform lt-lg:transition-transform lt-lg:duration-350" :class="{'lt-lg:-translate-x-[calc(100%+68px)]': sidebarCollapsed}">
                <div class="h-full p-3 bg-dark-05 rounded-tl-xl rounded-bl-xl">
                    <slot name="sub-navigation"></slot>
                </div>
            </div>
            <n-layout-content :native-scrollbar="false" ref="contentRef" content-class="lg:py-6" :scrollbar-props="{xScrollable: true	}">
                <div class="content-wrapper rounded-xl bg-hex-1A1D1E">
                    <slot />
                </div>
            </n-layout-content>
            <div :class="$slots?.['right-sidebar'] ? 'w-14' : ''">
                <slot name="right-sidebar"></slot>
            </div>
        </n-layout>
    </n-layout>
</template>

<script setup lang="ts">
const contentRef = useState('chatboxRef', () => null)
const sidebarCollapsed = useState('sidebarCollapsed')

console.log('sidebarCollapsed', sidebarCollapsed)
</script>

<style lang="scss">
.content-box {
    .n-layout-scroll-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 73px);
        height: calc(100dvh - 73px);
    }
    .n-layout-content {
    }
}

.content-wrapper {
    min-height: calc(100vh - 121px);
    min-height: calc(100dvh - 121px);
}
</style>