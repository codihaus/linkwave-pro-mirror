<template>
    <n-modal v-model:show="model">
        <div class="bg-neutral-08 w-11/12 lg:w-225 flex flex-col lg:flex-row rounded-2xl divide-y divide-neutral-09 lg:divide-x lg:divide-y-0">
            <div class="lg:w-6/12 px-4 py-5 lg:px-6 lg:py-12">
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
                    <n-form-item :show-label="false" label="" path="share">
                        <div class="w-full flex gap-3 px-4 py-3 justify-between border border-neutral-05 rounded">
                            <div class="text-neutral-02">Share with team</div>
                            <n-switch v-model:value="project.share" />
                        </div>
                    </n-form-item>
                    <n-form-item v-if="project.share" :show-label="false" label="" path="project_members">
                        <div class="w-full flex gap-3 px-4 py-3 justify-between border border-neutral-05 rounded">
                            <div class="text-neutral-02">Invite people</div>
                            <n-button text icon style="--n-height: 24px;">
                                <template #icon>
                                    <i class="i-custom-add-user text-2xl leading-0" />
                                </template>
                            </n-button>
                        </div>
                    </n-form-item>
                    <n-button
                        block
                        strong
                        type="primary"
                        attr-type="submit"
                        :loading="pending"
                        :disabled="pending"
                        size="large"
                        >
                        Next
                    </n-button>
                </n-form>
            </div>
            <div class="lg:w-6/12 px-4 py-5 lg:px-6 lg:py-12"></div>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
import { readItems, aggregate } from '@directus/sdk'

const model = defineModel('modelValue', {
    type: Boolean,
    default: false
})


const project = ref({
    name: null,
    country: null,
    location: null,
    type: null,
    description: null,
    share: null,
    project_members: null,
});

const { formRef, rules, pending, apiErrors, onSubmit, edited, reset, updateResetValue } = useNaiveForm(project);

rules.value = {
    email: [
        {
            required: true,
            message: "Wrong email format!",
            // trigger: ['input', 'blur'],
            validator: (rule, value) => value === null || isValidEmail(value),
        },
        {
            message: "Wrong credentials",
            validator: () => !apiErrors.value.wrongCredentials,
        },
    ],
    password: [
        {
            required: true,
        },
        {
            message: "Wrong credentials",
            validator: () => !apiErrors.value.wrongCredentials,
        },
    ],
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
        transform: (response) => response?.items?.map(({id, name}) => ({
            label: name,
            value: id
        })),
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

async function handleSubmit() {

}
</script>

<style scoped>

</style>