<template>
    <main class="min-h-screen min-h-100dvh w-full flex bg-black">
        <div class="hidden lg:flex items-center justify-center w-full lg:w-5/12 p-5">
            <div>
                <div class="px-4 lg:px-11">
                    <div class="f-text-24-32 font-bold text-neutral-01">Empowering Contractors with Intelligent Solutions</div>
                    <div class="text-neutral-03 text-op-50 mt-4">This AI-powered construction software delivers cloud-based takeoff and estimating, customizable reporting, and a user-friendly interface, enhancing efficiency, accuracy, and collaboration.</div>
                </div>
                <img src="/images/auth-image.png" class="mx-auto lg:max-w-6/10">
            </div>
        </div>
        <div class="w-full lg:w-7/12 flex items-center justify-center bg-black py-6 px-4 lg:pr-6 lg:pl-0">
            <div class="w-full h-full flex flex-col items-center gap-6 bg-neutral-06 p-4 rounded-2xl">
                <div class="mt-6">
                    <layout-logo dark />
                </div>
                <div class="my-auto w-full lg:w-6/12">
                    <slot />
                </div>
            </div>
        </div>
    </main>
</template>
<script setup lang="ts">
</script>