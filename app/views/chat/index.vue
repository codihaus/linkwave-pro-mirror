<template>
	<div class="container">
		<div v-if="messages" class="min-h-[calc(100dvh-250px)] flex flex-col">
			<message :messages="messages" />
		</div>
		<div v-else class="min-h-[calc(100dvh-250px)] flex flex-col">
			<div class="f-text-24-44 leading-title text-primary xxl:text-6xl">Hi {{ currentUser?.first_name }} </div>
			<div class="f-text-24-44 leading-title text-heading xxl:text-6xl">How can I help you today?</div>
			<div class="mt-auto">
				<div class="text-base lg:text-xl leading-title text-heading font-light">You can start your day with our suggestion</div>
				<div class="flex w-full lg:grid grid-cols-1 lg:grid-cols-4 gap-5 mt-4 leading-title overflow-x-auto">
					<div v-for="item in samples" class="suggestion group" :class="{'opacity-50 pointer-events-none': item?.disabled}">
						<div v-if="item?.label" class="label">{{ item?.label }}</div>
						<img :src="item?.icon" alt="">
						<h3 class="f-text-16-24 text-heading mt-7.5">{{ item?.title }}</h3>
						<div class="text-sm lg:text-base font-light text-content mt-5 group-hover:text-heading">{{ item?.content }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { readSingleton, updateMe } from '@directus/sdk';
import { APIServer } from '~/base/composables/api-server';
import "@sjmc11/tourguidejs/src/scss/tour.scss"
import {TourGuideClient} from "@sjmc11/tourguidejs/src/Tour"
import message from './components/message.vue'

definePageMeta({
	auth: true
})

const currentUser = useState("currentUser")

// const client = APIServer.getInstance()
// const { data: app_settings } = await useAsyncData(
// 	'app_settings',
// 	() => useAPI(() => readSingleton('app_settings', {
//         fields: ['file_template.analysis_file.id', 'file_template.analysis_file.filesize', 'file_template.3d_file']
//     })), 
// 	{
// 		transform: (response) => response?.items
// 	}
// )
const { app_settings } = await useAppSetting()

const messages = useState('')


const steps = ref([
	{
		target: '.first-step-0',
		title: '',
		body: `Feel free to interact with chatbot. Example: estimate this floor plan, searching nearby contractor,...`
	},
	{
		target: '.first-step-1',
		title: '',
		popperConfig: {
			placement: 'right'
		},
		body: `Create new request or find your old request here`
	},
])

const welcomeTour = ref(null)

onMounted(() => {
    // welcomeTour.value?.startTour();
	// const tg = new TourGuideClient();
	// tg.start() 
});

const samples = ref([
	{
		title: 'Question & Answering',
		content: 'AI-powered Expert to answer the construction regulation & building codes',
		icon: '/images/chat/chart.svg',
		label: 'Beta'
	},
	{
		title: 'Project take-off',
		content: 'Upload material list to create a new project',
		icon: '/images/chat/discovery.svg',
		label: 'Coming Soon',
		disabled: true
	},
	{
		title: 'Suggest furniture & interior',
		content: 'Try our AI-powered recommendation',
		icon: '/images/chat/document.svg',
		label: 'Coming Soon',
		disabled: true
	},
	{
		title: 'Find nearby contractor',
		content: 'Please allow location access to start find ',
		icon: '/images/chat/search.svg',
		label: 'Coming Soon',
		disabled: true
	},
])
</script>
<style lang="scss">
.suggestion {
	width: 80%;
	flex-shrink: 0;
	padding: 35px 24px;
	border-radius: 20px;
	background-color: #16203E;
	position: relative;
	@screen lg {
		width: 100%;
	}
	&:hover {
		background: linear-gradient(32.62deg, #0EC3A6 4.63%, rgba(7, 93, 79, 0) 168.83%);
	}
	.label {
		color: #0A142C;
		background: #14E3AE;
		font-size: 12px;
		font-weight: 300;
		line-height: 1.3;
		padding: 4px 16px;
		position: absolute;
		top: 0;
		right: 0;
		border-radius: 0 20px 0px 20px;
	}
}
</style>