<template>
    <div class="flex items-center justify-center min-h-screen bg-white py-48">
        <div class="flex flex-col items-center">
            <div class="text-indigo-500 font-bold text-7xl">
                {{ error.statusCode }}
            </div>
            <div
                class="text-gray-400 font-medium text-sm md:text-xl lg:text-2xl my-8"
            >
                {{ error.message }}
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    error: Object,
});

const handleError = () => clearError({ redirect: "/" });
</script>
