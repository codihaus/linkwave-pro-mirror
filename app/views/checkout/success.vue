<template>
    <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
                <div class="f-w-64-128 f-h-64-128 rounded-full flex items-center justify-center text-white bg-primary">
                    <i class="i-custom-check text-5xl leading-0 flex-shrink-0"></i>
                </div>
                <div class="text-4xl leading-title mt-12 text-heading">Thank you for your purchase!</div>
                <div class="lg:text-2xl mt-7">Your order has been received and is currently being processed. You will receive an email confirmation with your order details shortly.</div>
                <n-button type="primary" size="large" class="mt-7" @click="navigateTo('/')">
                    <i class="i-custom-plus mr-2"></i>
                    New chat
                </n-button>
            </div>
            <div>
                <div class="grid grid-cols-1 gap-5">
                    <div v-for="item in samples" class="suggestion group flex items-center gap-7.5 !py-4" :class="{'opacity-50 pointer-events-none': item?.disabled, 'cursor-pointer': !item?.disabled}" @click="navigateTo('/')">
						<div v-if="item?.label" class="label">{{ item?.label }}</div>
						<img :src="item?.icon" alt="">
						<h3 class="f-text-16-24 text-heading">{{ item?.title }}</h3>
					</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
	auth: true
})

const samples = ref([
	{
		title: 'LinkWavePro',
		// content: 'AI-powered Expert to answer the construction regulation & building codes',
		content: 'Everything with AI-Powered chatbot',
		icon: '/images/chat/chart.svg',
		label: 'Beta'
	},
	{
		title: 'LinkWavePro',
		content: 'Upload material list to create a new project',
		icon: '/images/chat/discovery.svg',
		label: 'Coming Soon',
		disabled: true
	},
	{
		title: 'LinkWave Market',
		content: 'Try our AI-powered recommendation',
		icon: '/images/chat/document.svg',
		label: 'Coming Soon',
		disabled: true
	},
	{
		title: 'LinkByteIT',
		content: 'Please allow location access to start find ',
		icon: '/images/chat/search.svg',
		label: 'Coming Soon',
		disabled: true
	},
])
</script>

<style scoped>

</style>