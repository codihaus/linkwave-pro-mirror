<template>
    <n-layout has-sider class="h-100dvh">
        <layout-sidebar />
        <n-layout class="content-box">
            <div class="circle-yellow"></div>
            <div class="circle-cyan"></div>
            <div class="bg-overlay"></div>
            <layout-header />
            <n-layout-content :native-scrollbar="false" ref="contentRef" content-class="lg:p-6">
                <slot />
            </n-layout-content>
            <layout-footer />
        </n-layout>
    </n-layout>
</template>

<script setup lang="ts">
const contentRef = useState('chatboxRef', () => null)
</script>

<style lang="scss">
.circle-yellow {
    /* Light */
    position: absolute;
    width: 234.8px;
    height: 234.8px;
    right: 20%;
    top: 46px;
    border-radius: 50%;
    background: #FFB200;
    mix-blend-mode: screen;
    filter: blur(50px);
    pointer-events: none;
}
.circle-cyan {
    pointer-events: none;
    position: absolute;
    width: 435px;
    height: 434px;
    right: -17px;
    top: 46px;
    border-radius: 50%;
    background: #00C3B2;
    mix-blend-mode: screen;
    filter: blur(50px);
}
.bg-overlay {
    background: #0A142C80;
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
}
.content-box {
    .n-layout-scroll-container {
        overflow: hidden;
        height: 100vh;
        height: 100dvh;
        display: flex;
        flex-direction: column;
    }
    .n-layout-content {
        height: calc(100vh - 218px);
        height: calc(100dvh - 218px);
    }
}
</style>