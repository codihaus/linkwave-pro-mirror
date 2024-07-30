<template>
    <div class="container">
        <div class="min-h-[calc(100dvh-250px)] flex flex-col text-heading">
            <message v-if="messages?.length || route?.params?.id" :messages="messages" :suggestions="suggestions" @action-upload="onWelcomeUpload" />
            <template v-else>
                <div class="f-text-24-44 leading-title text-primary xxl:text-6xl">Hi {{ currentUser?.first_name }} </div>
                <div class="f-text-24-44 leading-title text-heading xxl:text-6xl">How can I help you today?!</div>
                <div class="mt-auto">
                    <div class="text-base lg:text-xl leading-title text-heading font-light">You can start your day with our suggestion</div>
                    <div class="flex w-full lg:grid grid-cols-1 lg:grid-cols-4 gap-5 mt-4 leading-title overflow-x-auto">
                        <div v-for="item in samples" class="suggestion group" :class="{'opacity-50 pointer-events-none': item?.disabled, 'cursor-pointer': !item?.disabled}" @click="showQA(item)">
                            <div v-if="item?.label" class="label">{{ item?.label }}</div>
                            <img :src="item?.icon" alt="">
                            <h3 class="f-text-16-24 text-heading mt-7.5">{{ item?.title }}</h3>
                            <div class="text-sm lg:text-base font-light text-content mt-5 group-hover:text-heading">{{ item?.content }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div ref="lastEl"></div>
        <client-only>
            <teleport to='#footer-content'>
                <chat-box v-if="route.name === 'chat-thread' || messages?.length" @input="onInput"/>
            </teleport>
            <teleport to='#header-analyzing'>
                <div class="lg:relative text-heading text-sm fixed top-15 right-0 lg:top-0">
                    <div class="px-4 py-1 bg-dark-01 gap-2 rounded flex items-center cursor-pointer hover:outline hover:outline-primary" @click="showAnalyzer = !showAnalyzer">
                        <div class="text-right">
                            <div>{{ analyzedFiles?.length === threadFiles?.length ? 'Completed' : 'Analyzing'}}</div>
                            <div class="text-primary">{{ analyzedFiles?.length }}/{{ threadFiles?.length }} files</div>
                        </div>
                        <i class="i-custom-down text-base"></i>
                    </div>
                    <ui-gradient-corner class="min-w-xs absolute rounded top-full right-0 transform transition" :class="{'translate-x-10 opacity-0 invisible': !showAnalyzer}" wrapper-class="p-3 bg-dark-02">
                        <div class="text-content flex items-center justify-between">
                            Analyze history
                            <i class="i-custom-close text-base cursor-pointer hover:text-white" @click="showAnalyzer=false"></i>
                        </div>
                        <n-scrollbar class="mt-4 h-xs">
                            <div class="space-y-3 p-0.5">
                                <analyzer-file v-for="item in threadFiles" :item="item" @click="selectFile(item)"/>
                            </div>
                        </n-scrollbar>
                    </ui-gradient-corner>
                </div>
            </teleport>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { rand } from '@vueuse/core';
import message from './components/message.vue'
import chatBox from './components/chat-box.vue'
import analyzerFile from './components/analyzer-file.vue'
import { customEndpoint, readSingleton, updateMe } from '@directus/sdk';
import { APIServer } from '~/base/composables/api-server';
import { get, last, set, uniqBy } from 'lodash-es';
import destr from 'destr';

definePageMeta({
    auth: true
})

const route = useRoute()

// const { data: app_settings } = await useAsyncData(
// 	'app_settings',
// 	() => useAPI(() => readSingleton('app_settings', {
//         fields: [ 'file_template.analysis_file.id', 'file_template.analysis_file.filesize', 'file_template.3d_file']
//     })), 
// 	{
// 		transform: (response) => response?.items
// 	}
// )

const { app_settings } = await useAppSetting()

const currentUser = useState('currentUser')
const chatboxRef = useState('chatboxRef', () => null)
const tmpMessages = useState('tmpMessages', () => [])


// const messages = ref([])

const user = {
    avatar: currentUser.value?.avatar ? useCMSUrl(`assets/${currentUser.value?.avatar}`) : '',
    type: 'user'
}

const userAI = {
    avatar: '/images/chat/ai-avatar.svg',
    type: 'ai'
}

const api = useNAD()

const { data: messages } = await useAsyncData(
    () => route?.params?.id ? api.request(
        customEndpoint({
            method: 'GET',
            path: `/chat/message/${getThreadID(route?.params?.id)}`
        })
    ) : {},
	{
		transform: (response) => {
            let output = (response?.messages || [])?.sort((a, b) => a.created_at - b.created_at)?.map((mess) => {
                let content = get(mess?.content, '0.text.value')?.replace(/\s+$/, '')
                let annotations = get(mess?.content, '0.text.annotations')?.map((item) => {
                    content = content?.replaceAll(item?.text, item?.file_citation?.file_id)
                    return {
                        name: item?.file_citation?.file_id,
                        text: item?.text
                    }
                })

                annotations = uniqBy(annotations, 'name') || null
                annotations?.map((item, index) => {
                    content = content?.replaceAll(item?.name, ` [(${index+1})](#)`)
                })


                return {
                    user: mess?.role === 'user' ? user : userAI,
                    type: 'message',
                    attachments: mess.attachments?.map((attachment) => attachment?.file_id),
                    annotations,
                    content,
                    id: mess?.id
                }
            })
            console.log('thread', output)

            if( route.params?.id ) {
                return output?.length ? output : tmpMessages.value
            }
            return []
        },
        default: () => []
	}
)

onMounted(() => {
    goLast()
})

const AIMessage = computed(() => ({
    type: 'message',
    user: userAI,
    content: ``,
}))

const loadingMessage = {
    type: 'loading',
    user: userAI,
}

const lastEl = ref<HTMLDivElement>()

function goLast(smooth: boolean = false) {
    let option = {
        top: lastEl.value?.offsetTop,
    }

    if( smooth ) {
        option.behavior = 'smooth'
    }

    chatboxRef.value.scrollTo(option)
}

function setLastMessage(message) {
    const lastMessage = last(messages.value)
    
    if( lastMessage?.user?.type === 'user' ) {
        messages.value.push(message)
        return
    }

    messages.value[messages.value.length-1] = {
        ...lastMessage,
        ...message,
        content: lastMessage?.content + (message?.content || '')
    }
}

async function onInput(inputMessages:any) {

    if( get(inputMessages, '0.user.type') === 'user' ) {
        messages.value.push(...inputMessages)
        goLast(true)
        return
    }

    if( ['analyzing', 'notification'].includes(inputMessages?.type)  ) {
        messages.value.push(inputMessages)
        goLast(true)
        return
    }

    console.log('inputmess', inputMessages)

    setLastMessage(inputMessages)
    // setTimeout(() => {
        goLast()
    // }, 50)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function printStringPerCharacter(str, options = () => ({})) {
    for (let i = 0; i < str.length; i++) {
        onInput({
            type: 'message',
            stream: str.length - 1 > i,
            user: userAI,
            content: str[i],
            ...options(i),
        })
        await sleep(20);
    }
}

// const welcomeMessage = `LinkWave AI Construction Expert can help you to understand and answers all questions related to building codes with latest update and knowledge. Let's ask something!`
const welcomeMessage = `Hello, would you like LinkWaveAI to thoroughly analyze your FloorPlan drawing to provide more accurate answers to your questions?`
const noUploadMessage = `Thank you for confirming. Feel free to ask me any questions about the project you are working on.`

function showQA(item:any) {
    if( item?.label === 'Beta' ) {
        messages.value.push({
            type: 'message',
            user: userAI,
            content: '',
            stream: true
        })
        printStringPerCharacter(welcomeMessage, (i) => ({
            askUpload: welcomeMessage.length - 1 === i,
        }))
    }
}

const uploadField = useState<HTMLDivElement>('uploadField')

function onWelcomeUpload(open) {
    if( open ) {
        uploadField.value?.openOpenFileDialog()
        return
    }

    messages.value.push({
        user: user,
        type: 'message',
        content: 'No'
    })
    printStringPerCharacter(noUploadMessage)
}

const refreshMessage = useState('refreshMessage', () => false)

watch(refreshMessage, () => {
    if( refreshMessage.value === true ) {
        messages.value = []
        refreshMessage.value = false
    }
})

const suggestions = ref([
    {
        label: 'View your floor in 3D',
        action: () => {
            createAIMessage({
                type: 'message',
                user: userAI,
                image: useCMSUrl(`assets/${app_settings.value?.file_template?.['3d_file']}/?download`)
            }, 300)
        }
    },
    {
        label: 'Create construction project',
        disabled: true,
        action: () => {}
    },
    {
        label: 'Find nearby contractor',
        disabled: true,
        action: () => {}
    },
    {
        label: 'Can you show all section & room detail?',
        disabled: true,
        action: () => {}
    },
    {
        label: 'View keynote',
        disabled: true,
        action: () => {}
    },
    {
        label: 'How many window in this floor plan?',
        disabled: true,
        action: () => {}
    },
])


const samples = ref([
	{
		title: 'LinkWaveAI',
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



const showAnalyzer = ref(false)
const refreshAnalyzingFiles = useState('refreshAnalyzingFiles', () => false)
const items = ref([])

const threadFiles = computed(() => items.value?.filter(({thread_id}) => {
    console.log('thread_id', thread_id, getThreadID(route.params?.id) )
    return thread_id == getThreadID(route.params?.id)
} ))
const analyzedFiles = computed(() => items.value?.filter(({thread_id, analysis_id}) => analysis_id && thread_id == getThreadID(route.params?.id) ))

console.log('threadFiles', threadFiles)

const socket = useRealtime()

const analyzeSocket = useState('analyzeSocket')

async function connectAnalyzingFile() {
    analyzeSocket.value = socket
    await socket?.connect();
}

async function subscribe() {
    const { subscription } = await socket?.subscribe('file_analyzer', {
        query: {
            filter: {
                user_created: currentUser.value?.id,
            },
            fields: ['3d_file', 'analysis_file', 'analysis_id', 'file_source.*', 'id', 'message_content', 'thread_id', 'user_created'],
            sort: '-date_created'
        },
    });

    for await (const sub of subscription) {

        if( sub?.event === 'init' ) {
            items.value = sub?.data
        }

        console.log('subscribe item', sub);
    }   
}

watch(items, () => {
    messages.value = messages.value?.map((message) => {
        return {
            ...message,
            attachments: message.attachments?.map((attachment) => {
                let file = items.value?.find(({analysis_id}) => analysis_id === attachment)
                if( !file ) {
                    return attachment
                }
                return {
                    name: file?.file_source?.filename_download,
                    size: file?.file_source?.filesize,
                    id: attachment,
                    upload: true,
                }
            })
        }
    })
})

const messageNoti = useMessage()

onMounted(async () => {
    console.log('onMounted')
    await connectAnalyzingFile()
    
    console.log('onMount socket')

    socket?.onWebSocket('message', function (message) {
        const { type, data, event } = message;
        if (event === 'create') {
            items.value.unshift(data?.[0])
        }

        if (message.type === 'ping') {
            socket?.sendMessage({
                type: 'pong',
            });
        }
        
        if (event === 'update') {
            console.log('updated item', message)
            data?.map((updateItem) => {
                let item2UpdateIndex = items.value?.findIndex((item) => item?.id === updateItem?.id)

                console.log('update file', updateItem?.analysis_id, item2UpdateIndex?.analysis_id);
                console.log('update file noti condition', updateItem?.analysis_id && !item2UpdateIndex?.analysis_id)

                if( item2UpdateIndex < 0 ) {
                    return
                }
                if( get(updateItem, 'analysis_id') !== get(items.value, `${item2UpdateIndex}.analysis_id` )) {
                    let notiMess = `${updateItem?.file_source?.filename_download} has been analyzed completely`
                    messageNoti.success(notiMess)
                    onInput({
                        type: 'notification',
                        stream: false,
                        user: userAI,
                        content: `**${updateItem?.file_source?.filename_download}** has been analyzed completely`
                    })
                }
                set(items.value, `${item2UpdateIndex}`, updateItem)
            })
        }
        
        console.log({ event: 'onmessage', data, message });

    });

    socket.onWebSocket('close', function () {
        console.log({ event: 'onclose' });
    });

    subscribe()
})

onUnmounted(async () => {
    console.log('onUnmounted')
    await socket?.disconnect()
})

const AIAnalyzing = useState('AIAnalyzing', () => false)

async function selectFile(file) {

    if( ! file?.analysis_id ) {
        return
    }

    onInput([
        {
            user: {
                avatar: currentUser.value?.avatar ? useCMSUrl(`assets/${currentUser.value?.avatar}`) : '',
                type: 'user'
            },
            content: file?.message_content,
            attachments: [
                {
                    name: file?.file_source?.filename_download,
                    percentage: 100,
                    size: file?.file_source?.filesize,
                    type: 'pdf',
                    upload: false
                }
            ]
        },
        {
            type: 'loading',
            user: {
                avatar: '/images/chat/ai-avatar.svg',
                type: 'ai'
            },
            content: ``,
            stream: true,
        }
    ])

    const { data: createdMessage } = await useAsyncData(async () => {
    
        let response = await $fetch('/api/chat/message/stream', {
            method: 'POST',
            responseType: 'stream',
            body: {
                content: file?.message_content,
                thread_id: file?.thread_id,
                files: [file?.analysis_id]
            },
            transform: (res) => destr(res)
        })
        const reader = response.getReader();
        const decoder = new TextDecoder('utf-8');
        let streamResult = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            let streamEvent = decoder.decode(value, { stream: true })
            streamEvent = streamEvent?.replaceAll("\n{", "{");
            streamEvent = streamEvent?.replaceAll("}{", "},{");
            streamEvent = destr(`[${streamEvent}]`)
            console.log('streamEvent', streamEvent )

            for (let i = 0; i < streamEvent?.length; i++) {
                let data = get(streamEvent[i], 'data')
                if( data?.length ) {
                    onInput({
                        type: 'message',
                        content: data?.map((text) => text?.text?.value).join(' ')
                    });

                }
                await sleep(5)
            }

            streamResult += streamEvent;
        }
        onInput({
            stream: false
        })
        AIAnalyzing.value = false
        return streamResult;
    })
}

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
.btn-suggestion.n-button {
    --n-text-color-disabled: #E7E7E7;
    --n-color-disabled: #AAAAAA;
    --n-opacity-disabled: 0.5;
    &:not(.n-button--disabled):hover {
        --n-text-color-hover: #0A142C;
        --n-color-hover: #14E3AE;
    }
}
.loader {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    position: relative;
    animation: rotate 1s linear infinite
}
.loader::before , .loader::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 5px solid #FFF;
    animation: prixClipFix 2s linear infinite ;
}
.loader::after{
    inset: 8px;
    transform: rotate3d(90, 90, 0, 180deg );
    border-color: #14E3AE;
}

@keyframes rotate {
    0%   {transform: rotate(0deg)}
    100%   {transform: rotate(360deg)}
}

@keyframes prixClipFix {
    0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
    50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
    75%, 100%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
}
</style>