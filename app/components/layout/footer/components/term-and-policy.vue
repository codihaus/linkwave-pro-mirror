<template>
    <client-only>
        <lazy-n-modal v-model:show="showWelcomeModal" :mask-closable="false">
            <div :class="{'container': showTerm}">
                <ui-gradient-corner wrapper-class="bg-dark-01">
                    <div v-if="!showTerm" class="p-6 lg:p-10 text-center text-heading">
                        <layout-logo class="inline-block" />
                        <div class="f-text-18-32 leading-title mt-4.5">
                            Welcome <span class="text-primary">{{ currentUser?.first_name }}</span>
                            <div>Let’s start our Journey together !</div>
                        </div>
                        <n-button
                            type="primary"
                            size="large"
                            class="mt-4.5"
                            @click="showTerm = true"
                        >
                            START
                        </n-button>
                    </div>
                    <div v-else class="p-4 lg:p-12 text-heading leading-title">
                        <div class="f-text-18-32 text-primary">Terms of Service & Privacy policy</div>
                        <n-scrollbar style="max-height: 60dvh" class="mt-5">
                            <div class="bg-dark-02 p-4 rounded content-block" v-html="app_settings?.term_and_privacy"></div>
                        </n-scrollbar>
                        <n-form
                            v-if="!currentUser?.is_accepted_term"
                            class="mt-6"
                            ref="formRef"
                            item-responsive
                            :rules="rules"
                            :model="acceptModel"
                            @submit.prevent="() => onSubmit(handleSubmit)"
                        >
                            <div class="lg:flex items-center justify-between">
                                <n-form-item :show-label="false" path="is_accepted_term">
                                    <n-checkbox v-model:checked="acceptModel.is_accepted_term">By using the service, I agree to the terms and privacy policy</n-checkbox>
                                </n-form-item>
                                <n-form-item offset="8" :show-label="false">
                                    <n-button
                                        block
                                        type="primary"
                                        attr-type="submit"
                                        :loading="pending"
                                        :disabled="pending || !acceptModel.is_accepted_term"
                                        size="large"
                                        class="mt-1.5"
                                        >
                                        CONTINUE
                                    </n-button>
                                </n-form-item>
                            </div>
                        </n-form>
                        <div v-else class="mt-5  text-center">
                            <n-button
                                type="primary"
                                size="large"
                                @click="showWelcomeModal=false"
                                >
                                CLOSE
                            </n-button>
                        </div>
                    </div>
                </ui-gradient-corner>
            </div>
        </lazy-n-modal>
        <!-- <v-tour ref="welcomeTour" highlight autoStart :steps="steps"></v-tour> -->
    </client-only>
</template>

<script setup lang="ts">
import { readSingleton, updateMe } from '@directus/sdk';
import { useAppSetting } from '~/app/composables/use-app-setting';
import { APIServer } from '~/base/composables/api-server';

const currentUser = useState("currentUser")
const showWelcomeModal = useState('showWelcomeModal', () => false)
const showTerm = useState('showTerm', () => false)

onMounted(() => {
	if( !currentUser.value?.is_accepted_term ) {
		showWelcomeModal.value = true
	}
})


// const client = APIServer.getInstance()
const api = useNAD()
// const { data: app_settings } = await useAsyncData(
// 	'app_settings',
// 	() => useAPI(() => readSingleton('app_settings', {
//         fields: ['term_and_privacy', 'file_template.analysis_file.id', 'file_template.analysis_file.size', 'file_template.3d_file']
//     })), 
// 	{
// 		transform: (response) => response?.items
// 	}
// )

const { app_settings } = await useAppSetting()

const acceptModel = ref({
	is_accepted_term: false
})

const { formRef, rules, pending, apiErrors, onSubmit, edited, reset, updateResetValue } = useNaiveForm(acceptModel);

rules.value = {
	is_accepted_term: [
        {
            required: true,
            message: 'You need to apcept this'
        },
    ],
}

const notify = useNaiveNotification()
const message = useMessage()

async function handleSubmit() {
	const updated = await api?.request(updateMe(acceptModel.value)).then(() => {
        message.success("Accepted Terms of Service & Privacy policy successfully!")
		showWelcomeModal.value = false
    }).catch(() => {
        notify.create({
            title: 'Error',
            type: 'error',
            description: 'Please try again!'
        })
    })

}
</script>

<style scoped>

</style>