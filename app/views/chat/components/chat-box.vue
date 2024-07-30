<template>
    <n-form
        class="chat-form first-step-0"
        ref="formRef"
        :rules="rules"
        :model="model"
        @submit.prevent="() => onSubmit(handleSubmit)"
        @keyup.enter="(e) => onSubmit(() => handleSubmit(e))"
        @keyup.shift.enter.prevent
    >
        <div ref="dropZoneRef" class="relative bg-dark-01 p-4 rounded-2xl focus-within:outline focus-within:outline-primary hover:outline hover:outline-primary focus:outline focus:outline-primary">
            <n-form-item :show-label="false" path="content">
                <n-input
                    v-model:value="model.content"
                    size="large"
                    placeholder="Start your day with prompt" style="--n-height: 48px;"
                    type="textarea"
                    class="content-input"
                    :autosize="{
                        minRows: 1,
                        maxRows: 5
                    }"
                >
                    <template #suffix>
                        <div>
                            <div class="flex items-center gap-3">
                                <div @click="openUpload" class="cursor-pointer hover:text-white">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.8288 7.75692L9.17177 13.4139C9.07626 13.5062 9.00008 13.6165 8.94767 13.7385C8.89526 13.8605 8.86768 13.9917 8.86652 14.1245C8.86537 14.2573 8.89067 14.389 8.94095 14.5119C8.99123 14.6348 9.06549 14.7464 9.15938 14.8403C9.25327 14.9342 9.36492 15.0085 9.48782 15.0587C9.61072 15.109 9.7424 15.1343 9.87518 15.1332C10.008 15.132 10.1392 15.1044 10.2612 15.052C10.3832 14.9996 10.4935 14.9234 10.5858 14.8279L16.2428 9.17192C16.8054 8.60926 17.1215 7.84614 17.1215 7.05042C17.1215 6.2547 16.8054 5.49158 16.2428 4.92892C15.6801 4.36626 14.917 4.05017 14.1213 4.05017C13.3256 4.05017 12.5624 4.36626 11.9998 4.92892L6.34277 10.5859C5.42478 11.5276 4.91475 12.7931 4.92318 14.1081C4.9316 15.4232 5.4578 16.682 6.38779 17.6119C7.31778 18.5418 8.57667 19.0678 9.89175 19.076C11.2068 19.0843 12.4722 18.574 13.4138 17.6559L19.0708 11.9999L20.4848 13.4139L14.8288 19.0709C13.516 20.3837 11.7354 21.1213 9.87877 21.1213C8.02216 21.1213 6.2416 20.3837 4.92877 19.0709C3.61595 17.7581 2.87842 15.9775 2.87842 14.1209C2.87842 12.2643 3.61595 10.4837 4.92877 9.17092L10.5858 3.51492C11.5273 2.59679 12.7927 2.08658 14.1078 2.09482C15.4229 2.10306 16.6818 2.62909 17.6118 3.55894C18.5417 4.4888 19.0679 5.74761 19.0764 7.06269C19.0848 8.37777 18.5748 9.64322 17.6568 10.5849L11.9998 16.2439C11.437 16.8064 10.6738 17.1224 9.87807 17.1222C9.08235 17.122 8.3193 16.8057 7.75677 16.2429C7.19425 15.6801 6.87833 14.9169 6.87852 14.1212C6.87871 13.3255 7.19499 12.5624 7.75777 11.9999L13.4138 6.34292L14.8288 7.75692Z" fill="currentColor"/>
                                    </svg>
                                </div>
                                <n-button
                                    text
                                    attr-type="submit"
                                    :loading="pending"
                                    :disabled="pending || !edited"
                                >
                                    <i class="i-iconoir:send-solid inline-block text-content-02"></i>
                                </n-button>
                            </div>
                        </div>
                    </template>
                </n-input>
            </n-form-item>
            <n-upload
                ref="uploadField"
                action=""
                accept="application/pdf"
                :show-file-list="false"
                :custom-request="upload"
                @change="onFileChange"
                @before-upload="beforeUpload"
            >
                <n-upload-dragger :class="isOverDropZone ? 'show' : '!hidden'">
                    <div>
                        <n-text style="font-size: 16px">
                            Click or drag a file to this area to upload
                        </n-text>
                        <div>Accept .PDF file</div>
                    </div>

                </n-upload-dragger>
            </n-upload>
            <attachment v-if="attachments.length" :items="attachments" class="mt-2.5" @delete="onDeleteFile"/>
        </div>
    </n-form>
</template>
<script setup lang="ts">
import attachment from './attachment.vue'
import { rand } from '@vueuse/core';
import { get, uniqBy } from 'lodash-es';
import { destr } from 'destr';
import { createItem, customEndpoint, uploadFiles } from '@directus/sdk';
import analyzerFile from './analyzer-file.vue'

const emit = defineEmits(['input'])

const route = useRoute()
const currentUser = useState('currentUser')
const message = useMessage()


const model = ref({
    content: '',
});
const { formRef, rules, pending, apiErrors, onSubmit, edited, reset, updateResetValue } = useNaiveForm(model);

const AIAnalyzing = useState('AIAnalyzing', () => false)
const refreshRecentThreads = useState('refreshRecentThreads', () => null)
const tmpMessages = useState('tmpMessages', () => [])

const api = useNAD()

async function handleSubmit(e: any = null) {
    if( e?.shiftKey && e?.keyCode === 13 ) {
        return
    }

    console.log('AIAnalyzing.value', AIAnalyzing.value)

    if( AIAnalyzing.value === true ) {
        return
    }

    let content = get(model.value, 'content')?.replace(/\s+$/, '')

    if( !content && attachments.value?.length < 1 ) {
        return
    }

    let firstMessages = [
        {
            user: {
                avatar: currentUser.value?.avatar ? useCMSUrl(`assets/${currentUser.value?.avatar}`) : '',
                type: 'user'
            },
            content,
            attachments: attachments.value?.map((f) => ({
                ...f,
                upload: false
            }))
        },
    ]

    emit('input', firstMessages)

    tmpMessages.value = firstMessages

    let analyzingFile = get(attachments.value, '0')
    
    model.value.content = ''
    attachments.value = []
    uploaded.value = null
    uploadField.value?.clear()

    let thread_id = getThreadID(route?.params?.id)

    if( route.name === 'home' ) {
        const { data: createdThread } = await useAsyncData(() => api.request(customEndpoint({
            method: 'POST',
            path: '/chat/thread',
            body: JSON.stringify({
                title: content || analyzerFile?.name || 'New Request'
            })
        })))

        console.log('createdThread', createdThread.value)

        thread_id = createdThread.value?.thread?.id;
        refreshRecentThreads.value = true
    }

    if( analyzingFile?.file_id ) {
        console.log('analyzingFile', analyzingFile)
        await createAnalyzer({
            file_source: analyzingFile?.file_id,
            fileName: analyzingFile?.name,
            thread_id,
            message_content: content || 'Current working file, update to your memory'
        })
    }

    if( content && ! analyzingFile?.file_id ) {
        console.log('create stream', content, analyzingFile)
        emit('input', {
            type: 'loading',
            user: {
                avatar: '/images/chat/ai-avatar.svg',
                type: 'ai'
            },
            content: ``,
            stream: true,
        })
        const { data: createdMessage } = await useAsyncData(async () => {
    
            let response = await $fetch('/api/chat/message/stream', {
                method: 'post',
                responseType: 'stream',
                body: {
                    content,
                    thread_id
                },
                transform: (res) => destr(res)
            })
            const reader = response.getReader();
            const decoder = new TextDecoder('utf-8');
            let streamResult = '';

            let annotations = [];
            let contents = ''
    
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
                        
                        for(let j=0; j<data.length; j++ ) {
                            let text = get(data[j], 'text.value')
                            let content: string = text || ''
                            let annotation = get(data[j], 'text.annotations')?.map((item: any) => {
                                const existIndex = annotations.findIndex((an) => an.name === item?.file_citation?.file_id)

                                if( existIndex < 0 ) {
                                    annotations.push({
                                        name: item?.file_citation?.file_id,
                                        text: item?.text
                                    })
                                    content += ` [(${annotations.length})](#)`
                                }
                            })

                            emit('input', {
                                type: 'message',
                                content,
                                annotations
                            });
                        }
    
                    }
                    await resolveData(5)
                }
    
                streamResult += streamEvent;
            }
            emit('input', {
                stream: false,
            })
            AIAnalyzing.value = false
            return streamResult;
        })
    }


    AIAnalyzing.value = false

    if( route.name === 'home' && !route.params?.id && thread_id ) {
        navigateTo({
            name: 'chat-thread',
            params: {
                id: getThreadParamID(thread_id)
            },
            replace: true
        })
    }

}

function resolveData(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const dropZoneRef = ref<HTMLDivElement>()
const uploadField = useState<HTMLDivElement>('uploadField')
const uploadTrigger = ref<HTMLDivElement>()
const attachments = ref([])

const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop: () => {
        uploadField.value?.clear()
    },
    dataTypes: ['application/pdf']
})

function openUpload() {
    uploadField.value?.openOpenFileDialog()
}

const uploaded = ref(null)

function beforeUpload({file}) {
    console.log('beforeUpload', [file])
    attachments.value = [file]?.map((f) => ({
        name: f?.name,
        percentage: 0,
        size: f?.file.size,
        type: 'pdf',
        upload: true
    }))
}

function onFileChange({ file, fileList, event: Event }) {
    console.log(file, fileList, event)

    attachments.value = [file]?.map((f) => ({
        name: f?.name,
        percentage: f.percentage || 0,
        size: f?.file.size,
        type: 'pdf',
        upload: true
    }))
}

const chunkSize = 1024 * 1024;

async function upload({
    file,
    data,
    headers,
    withCredentials,
    action,
    onFinish,
    onError,
    onProgress
}) {

    console.log('upload', file)

    const formData = new FormData()

    formData.append('file', file.file)

    const fileID = file.name;
    const totalChunks = Math.ceil(file.file.size / chunkSize);
    
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        await sendChunk({
            file: file.file,
            chunkIndex,
            totalChunks,
            fileID,
            onProgress,
            onFinish,
            onError
        });
    }

    // try {
    //     const uploadedImage = await api.request(customEndpoint(formData));
    //     onProgress({percent: 100})
    //     onFinish()
    //     message.success('File has been uploaded successfully!')
    // } catch (error) {
    //     console.log(error)
    //     onError()
    //     message.error('Upload file failed! Please try again!')
    // }
}

function percentage(loaded, total) {
    return Math.floor((loaded * 100) / total)
}

async function sendChunk({
    file,
    chunkIndex,
    totalChunks,
    fileID,
    onProgress,
    onFinish,
    onError
}) {
    const isLastChunk = chunkIndex + 1 === totalChunks;
    const start = chunkIndex * chunkSize;
    const end = (chunkIndex + 1) * chunkSize;
    const formData = new FormData();
    const blobSlice = file.slice(start, end);

    formData.append('file', blobSlice, file.name);
    formData.append('chunkIndex', chunkIndex);
    formData.append('totalChunks', totalChunks);
    formData.append('filedId', fileID);
    let step = (totalChunks === 1) ? 0 : chunkIndex;
    let progress = percentage(step, totalChunks);
    
    try {
        const response = await api.request(customEndpoint({
            method: 'POST',
            path: '/upload-chunk/upload',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        }));
        
        progress = percentage(chunkIndex + 1, totalChunks);

        onProgress({percent: progress})

        if( isLastChunk ) {
            message.success('File has been uploaded successfully!')
            onFinish()
            attachments.value = attachments.value?.map((f) => ({
                ...f,
                upload: false,
                file_id: response?.file_id
            }))
            // await createAnalyzer(response?.file_id, file.name)
        }

    } catch (error) {
        progress = percentage(chunkIndex, totalChunks);
        message.error('Upload file failed! Please try again!')
        onError()

        console.log('error', error);
    }
}

async function createAnalyzer({file_source, fileName, thread_id, message_content}) {
    const { data: file_analyzer } = await useAsyncData(() => api.request(createItem('file_analyzer', {
        file_source, 
        message_content,
        thread_id
    }))
    , {
        transform: (res) => {
            console.log('res', res)
            return res
        } 
    })

    
    const { data: start_analyzing } = await useAsyncData(() => $fetch('/api/chat/assistant/start',{
        method: 'POST',
        path: '/chat/start',
        body: {
            analyze_id: file_analyzer.value?.id
        }
    })
    , {
        transform: (res) => {
            console.log('res', res)
            return res
        } 
    })


    
    console.log('response_id', file_analyzer.value)

    message.success(`${fileName} is analyzing by LinkWaveAI`)

    let analyzingMessage = {
        type: 'analyzing',
        user: {
            avatar: '/images/chat/ai-avatar.svg',
            type: 'ai'
        },
        content: `"${fileName}"`,
    }

    emit('input', analyzingMessage)

    tmpMessages.value.push(analyzingMessage)
}

function onDeleteFile(file) {
    attachments.value = attachments.value?.filter((f) => f.name !== file.name)
    uploaded.value = null
    uploadField.value?.clear()
}
</script>

<style lang="scss">
.chat-form {
    .n-form-item .n-form-item-feedback-wrapper:empty {
        display: none;
    }
    .content-input {
        --n-border-focus: 0;
        --n-border-hover: 0;
        --n-border: 0;
        --n-box-shadow-focus: 0;
        .n-input-wrapper textarea {
            padding-top: 12px;
            padding-bottom: 12px;
        }
        .n-input__suffix {
            align-items: end;
            padding: 12px 0;
        }
    }
}

.n-upload-dragger {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    --n-border-radius: 20px;
    --n-dragger-color: rgba(255,255,255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>