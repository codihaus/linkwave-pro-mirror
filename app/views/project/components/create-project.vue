<template>
    <n-modal v-model:show="showModal" @update:show="refreshQuota">
        <div class="relative bg-neutral-08 w-11/12 lg:w-225 my-20">
            <div class="absolute -top-3 -right-3">
                <n-button type="error" icon text @click="showModal = false">
                    <i class="i-custom-close text-2xl leading-0"></i>
                </n-button>
            </div>
            <div class="flex items-center justify-between gap-3 p-5 lg:px-6 border-b border-neutral-09">
                <div class="text-lg text-neutral-01">Create Project</div>
                <div>
                    <n-button
                        block
                        strong
                        type="primary"
                        :loading="pending"
                        :disabled="pending || uploading"
                        size="large"
                        @click="() => onSubmit(handleSubmit)"
                        >
                        Create
                    </n-button>
                </div>
            </div>
            <div class="flex flex-col lg:flex-row rounded-2xl divide-y divide-neutral-09 lg:divide-x lg:divide-y-0">
                <div class="lg:w-6/12 px-4 py-5 lg:px-6 lg:py-6">
                    <n-form
                        class=""
                        ref="formRef"
                        :rules="rules"
                        :model="project"
                        @submit.prevent="() => onSubmit(handleSubmit)"
                    >
                        <n-form-item :show-label="false" label="Name of project" path="name">
                            <n-input v-model:value="project.name" size="large" placeholder="Name of project"></n-input>
                        </n-form-item>
                        <n-form-item :show-label="false" label="Client's name" path="client_name">
                            <n-input v-model:value="project.client_name" size="large" placeholder="Client's name"></n-input>
                        </n-form-item>
                        <div class="grid grid-cols-2 gap-x-6">
                            <n-form-item :show-label="false" path="country" label="Country">
                                <n-select
                                    v-model:value="project.country"
                                    placeholder="Country"
                                    :options="countryOptions"
                                    size="large"
                                    filterable
                                />
                            </n-form-item>
                            <n-form-item :show-label="false" path="location" label="State">
                                <n-select
                                    v-model:value="project.location"
                                    placeholder="State"
                                    :options="stateOptions"
                                    size="large"
                                    filterable
                                />
                            </n-form-item>
                        </div>
                        <n-form-item :show-label="false" label="Address" path="address">
                            <n-input v-model:value="project.address" size="large" placeholder="Address"></n-input>
                        </n-form-item>
                        <n-form-item :show-label="false" path="type" label="Type of construction">
                            <n-select
                                v-model:value="project.type"
                                placeholder="Type of construction"
                                :options="typeOptions"
                                size="large"
                                filterable
                            />
                        </n-form-item>
                        <n-form-item :show-label="false" label="Description" path="description">
                            <n-input v-model:value="project.description" type="textarea" size="large" placeholder="Description"></n-input>
                        </n-form-item>
                        <n-form-item :show-label="false" label="Contractor's name" path="contractor_name">
                            <n-input v-model:value="project.contractor_name" size="large" placeholder="Contractor's name"></n-input>
                        </n-form-item>
                        <n-form-item label="Project's Thumbnail" path="logo">
                            <n-upload
                                ref="thumbnailField"
                                action=""
                                :max="1"
                                accept="image/*"
                                list-type="image-card"
                                :custom-request="uploadThumbnail"
                                @change="onThumbnailChange"
                                @before-upload="beforeUploadThumbnail"
                            >
                                Click to Upload
                            </n-upload>
                        </n-form-item>
                        <n-form-item :show-label="false" label="" path="share">
                            <div class="w-full flex gap-3 px-4 py-3 justify-between border border-neutral-05 rounded">
                                <div class="text-neutral-02">Share with team</div>
                                <n-switch v-model:value="project.share" />
                            </div>
                        </n-form-item>
                        <n-form-item v-if="project.share" :show-label="false" label="" path="project_members">
                            <n-select
                                v-model:value="project.project_members"
                                multiple
                                filterable
                                placeholder="example1@email.com, example2@email.com..."
                                :options="memberOptions"
                                :loading="loadingUser"
                                clearable
                                tag
                            />
                        </n-form-item>
                        <div v-if="project.share" class="text-neutral-04">
                            Fill email and press enter to invite member to project
                        </div>
                        
                    </n-form>
                </div>
                <div class="flex flex-col gap-4 lg:w-6/12 px-4 py-5 lg:px-6 lg:py-6">
                    <div class="text-white">Floor Plan</div>
                    <div v-if="!quota?.can_upload" class="py-2 px-2 mt-2 rounded text-red-300  bg-red-900">
                        You have reached the upload limit of this month <span class="font-semibold">({{quota?.current_plan?.max_files_upload - quota?.remaining}}/{{quota?.current_plan?.max_files_upload}} Files)</span>
                    </div>
                    <n-upload
                        class="flex items-stretch"
                        multiple
                        directory-dnd
                        :show-file-list="false"
                        :file-list="files"
                        ref="uploadField"
                        action=""
                        accept="application/pdf"
                        :custom-request="upload"
                        @change="onFileChange"
                        @before-upload="beforeUpload"
                    >
                        <n-upload-dragger class="flex flex-col items-center">
                            <div>
                                <div class="mb-6">
                                    <div class="inline-flex p-5 rounded-full bg-neutral-01 bg-opacity-10">
                                        <i class="i-custom-upload-2 text-2xl text-primary"></i>
                                    </div>
                                </div>
                                <div class="text-lg font-semibold leading-2rem text-neutral-01">
                                    Click or Drag & Drop your Floor Plan files here to upload
                                </div>
                                <div class="leading-relaxed text-neutral-01 text-opacity-20">
                                    Supported format: PDF
                                </div>
                            </div>
                        </n-upload-dragger>
                    </n-upload>
                    <div v-if="files?.length" class="min-h-60 flex flex-col gap-6 p-3 bg-neutral-06 rounded-xl mt-6">
                        <div v-for="file in files" class="flex gap-2.5">
                            <div class="relative flex-grow">
                                <n-progress
                                    type="line"
                                    :percentage="file?.percentage"
                                    :height="48"
                                    :border-radius="24"
                                    rail-color="#141718"
                                    :fill-border-radius="0"
                                    indicator-text-color="#fff"
                                    :status="getFileStatus(file)"
                                />
                                <div class="absolute inset-0 pl-4 py-3 flex items-center gap-2 text-white rounded-full text-neu">
                                    <i class="text-2xl leading-0 flex-shrink-0" :class="{
                                        'i-custom-check': file?.status === 'finished',
                                        'i-custom-process animate-spin': ['uploading', 'pending'].includes(file?.status),
                                        'i-custom-close': file?.status === 'error'
                                    }"></i>
                                    <div class="flex-grow pr-6">
                                        <div class="line-clamp-1">{{ file?.name }}</div>
                                    </div>
                                    <div class="w-10 text-right">
                                        <n-popover v-if="file?.status === 'error'" trigger="hover">
                                            <template #trigger>
                                                <n-button icon text type="primary" @click="retryFile(file)">
                                                    <i class="i-custom-retry text-2xl leading-0"></i>
                                                </n-button>
                                            </template>
                                            <span>Retry</span>
                                        </n-popover>
                                    </div>
                                </div>
                            </div>
                            <n-popover trigger="hover">
                                <template #trigger>
                                    <n-button icon text type="error" @click="removeFile(file)">
                                        <i class="i-custom-trash text-2xl leading-0"></i>
                                    </n-button>
                                </template>
                                <span>Remove</span>
                            </n-popover>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
import { readItems, aggregate, createItem, customEndpoint, inviteUser } from '@directus/sdk'
import { get } from 'lodash-es';

const showModal = defineModel('modelValue', {
    type: Boolean,
    default: false
})

const emit = defineEmits(['create'])

const notify = useNaiveNotification()

const project = ref({
    name: null,
    client_name: null,
    address: null,
    contractor_name: null,
    country: null,
    location: null,
    type: 'residential',
    description: null,
    logo: null,
    share: null,
    project_members: null,
});

const { formRef, rules, pending, apiErrors, onSubmit, edited, reset, updateResetValue } = useNaiveForm(project);

rules.value = {
    name: [
        {
            required: true,
            message: "This field is required!",
        },
    ],
    country: [
        {
            required: true,
            message: "This field is required!",
        },
    ],
    location: [
        {
            required: true,
            message: "This field is required!",
        },
    ],
    // project_members: [
    //     {
    //         message: "Wrong credentials",
    //         validator: (rule, value) => value === null || value?.map((e) => isValidEmail(e)),
    //     },
    // ],
};

const api = useNAD()
const { data: countryOptions } = await useAsyncData(
    'countryOptions',
    () => api.request(readItems('locations', {
        limit: -1,
        filter: {
            _and: [
                {
                    status: {
                        _eq: 'published'
                    },
                },
                {
                    parent: {
                        _null: true
                    }  
                }
            ]
        }
    })),
    {
        server: false,
        lazy: true,
        default: () => ([/* {
            label: 'Select country',
            value: null
        } */]),
        transform: (response) => {
            console.log('response')
            return response?.items?.map(({id, name}) => ({
                label: name,
                value: id
            }))
        },
    }
)

const { data: stateOptions } = await useAsyncData(
    'stateOptions',
    () => api.request(readItems('locations', {
        limit: -1,
        filter: {
            _and: [
                {
                    status: {
                        _eq: 'published'
                    },
                },
                {
                    parent: {
                        _eq: project.value?.country
                    }
                }
            ]
        }
    })),
    {
        server: false,
        lazy: true,
        watch: [() => project.value?.country],
        default: () => ([/* {
            label: 'Select state',
            value: null
        } */]),
        transform: (response) => {
            project.value.location = null
            if( !project.value?.country ) {
                return []
            }
            return response?.items?.map(({id, name}) => ({
                label: name,
                value: id
            }))
        },
    }
)

const typeOptions = ref([
    {
        label: 'Residential buildings',
        value: 'residential'
    },
    {
        label: 'Commercial buildings',
        value: 'commercial'
    },
    {
        label: 'Industrial buildings',
        value: 'industrial'
    },
    {
        label: 'Public buildings',
        value: 'public'
    },
    {
        label: 'Agricultural buildings',
        value: 'agricultural'
    },
])

const memberOptions = ref([])

const loadingUser = ref(false)

async function searchUser(query: string) {
    
}

const { data: quota, refresh: refreshQuota } = await useQuota()

const {
    uploadField,
    attachments,
    beforeUpload,
    onFileChange,
    upload,
    uploading,
    files,
    removeFile,
    retryFile,
    getFileStatus,
    resetUploadField
} = await useUpload(useState<HTMLDivElement>('uploadField'))

const {
    uploadField: thumbnailField,
    attachments: thumbnailAttachments,
    beforeUpload: beforeUploadThumbnail,
    onFileChange: onThumbnailChange,
    upload: uploadThumbnail,
    uploading: uploadingThumbnail,
    files: thumbnailFiles,
    removeFile: removeThumbnail,
    retryFile: retryThumbnail,
    getFileStatus: getThumbnailStatus,
    resetUploadField: resetUploadThumbnail
} = await useUpload(ref<HTMLDivElement>('thumbnailField'))

async function handleSubmit() {
    let data = {...project.value}
    delete data.country
    delete data.share

    if( files.value?.length ) {
        data.files = {
            create: files.value?.filter((f) => f?.file_id)?.map((file) => ({
                status: 'published',
                type: "floor",
                file: file?.file_id
            })),
            update: [],
            delete: [],
        }
    }

    if( thumbnailFiles.value?.length ) {
        data.logo = get(thumbnailFiles.value, '0.file_id')
    }

    try {
        const response = await api.request(customEndpoint({
            method: 'POST',
            path: '/project/create',
            body: JSON.stringify(data)
        }))
        reset()
        resetUploadField()
        notify.create({
            title: 'Created project successfully!',
            type: 'success',
            description: `Project: ${data?.name}`,
            duration: 3000
        })
        emit('create')
        showModal.value = false
    } catch (error) {
        notify.create({
            title: 'Create project failed!',
            type: 'error',
            description: `Project: ${data?.name}. Please try again!`,
            duration: 3000
        })
    }
}


</script>

<style scoped>

</style>