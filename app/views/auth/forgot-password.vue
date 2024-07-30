<template>
    <div class="w-full flex flex-wrap">
        <div class="auth-img hidden lg:block w-full lg:w-7/12"></div>
        <div class="w-full lg:w-5/12 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <ui-gradient-corner class="w-full lg:max-w-96" wrapper-class="bg-dark-02">
                <div class="px-8 py-10">
                    <div class="text-center"><layout-logo class="inline-block"/></div>
                    <n-form
                        v-if="!isSubmitted"
                        class="mt-6"
                        ref="formRef"
                        :rules="rules"
                        :model="model"
                        @submit.prevent="() => onSubmit(handleSubmit)"
                    >
                        <n-form-item :show-label="false" label="Email" path="email">
                            <n-input v-model:value="model.email" size="large" placeholder="Email address"></n-input>
                        </n-form-item>
                        <n-form-item v-if="route.query?.token" :show-label="false" path="password" label="Password">
                            <n-input v-model:value="model.password" size="large" type="password" placeholder="Password (at least 8 characters)"></n-input>
                        </n-form-item>
                        
                        <n-button
                            block
                            type="primary"
                            attr-type="submit"
                            :loading="pending"
                            :disabled="pending || !edited"
                            size="large"
                            >
                            Reset password
                        </n-button>
                        <div class="mt-4.5 text-center">
                            <nuxt-link to="/login" class="text-primary">Back to sign in</nuxt-link>
                        </div>
                    </n-form>
                    <div v-else class="mt-6 text-center">
                        <i v-if="!route.query?.token" class="inline-block text-7rem text-primary i-streamline:send-email-solid"></i>
                        <div class="text-heading leading-title mt-7.5">{{ route.query?.token ? 'Your password has been changed successfully.' : 'A reset password email has been sent to' }}</div>
                        <div v-if="!route.query?.token" class="text-1.375rem leading-title text-primary">{{ model.email }}</div>
                        <div v-if="!route.query?.token" class="text-heading leading-title mt-1.25">Please follow the instructions in the email</div>
                        <n-button
                            v-if="!route.query?.token"
                            type="primary"
                            block
                            size="large"
                            class="mt-4"
                            ghost
                            @click="requestPassword"
                        >Resend</n-button>
                        <n-button
                            v-else
                            type="primary"
                            block
                            size="large"
                            class="mt-4"
                            ghost
                            @click="navigateTo('/login')"
                        >Login</n-button>
                    </div>
                </div>
            </ui-gradient-corner>
        </div>
    </div>
</template>

<script setup lang="ts">
import { passwordRequest, passwordReset } from '@directus/sdk';

const route = useRoute()

const isSubmitted = ref(false)
const isSent = ref(false)

const model = ref({
    email: route.query?.token ? jwtPayload(route.query?.token)?.email : null,
    password: "",
    retype_password: "",
});

const { formRef, rules, pending, apiErrors, onSubmit, edited, reset, updateResetValue } = useNaiveForm(model);

rules.value = {
    email: [
        {
            required: true,
            message: "Wrong email format!",
            // trigger: ['input', 'blur'],
            validator: (rule, value) => isValidEmail(value),
        },
    ],
};

const api = useNAD()
const message = useMessage()


async function requestPassword() {
    try {
        const { data: requested, pending: sending } = await useAsyncData(() => api.request(
            passwordRequest(model.value?.email, '')
        ))
        message.success('Successfully!')
        isSubmitted.value = true
    } catch (e) {
        isSubmitted.value = false
        message.error('Failed! Please try again.')
    }
}

async function resetPassword() {
    try {
        const { data: reseted } = await useAsyncData(() => api.request(
            passwordReset(route.query?.token, model.value?.password)
        ))
        message.success('Your password has been changed successfully.')
        isSubmitted.value = true
    } catch (e) {
        isSubmitted.value = false
        message.error('Failed! Please try again.')
    }
}

async function handleSubmit() {
    if( route.query?.token ) {
        await resetPassword()
        return
    }

    await requestPassword()
    
}

useHead({
    title: 'Forgot password - Beta - LinkWaveAI'
})
</script>

<style lang="scss">
</style>