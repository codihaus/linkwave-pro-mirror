<template>
    <n-form
        v-if="!isSubmitted"
        class="mt-6"
        ref="formRef"
        :rules="rules"
        :model="model"
        @submit.prevent="() => onSubmit(handleSubmit)"
    >
        <div class="text-2xl font-semibold mb-8 text-neutral-01">{{ route.query?.token ? 'Change your password' : 'Reset your password'}}</div>
        <n-form-item :show-label="false" label="Email" path="email">
            <n-input v-model:value="model.email" size="large" placeholder="Email address"></n-input>
        </n-form-item>
        <n-form-item v-if="route.query?.token" :show-label="false" path="password" label="Password">
            <n-input v-model:value="model.password" size="large" type="password" placeholder="Password (at least 8 characters)"></n-input>
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
            Reset password
        </n-button>
        <div class="mt-6 text-neutral-04  text-xs font-medium">Enter your email address and we will send the instructions on how to change your password.</div>
        <div class="mt-4.5 text-center">
            <nuxt-link to="/login" class="text-primary">Back to sign in</nuxt-link>
        </div>
    </n-form>
    <div v-else class="mt-6">
        <div v-if="!route.query?.token" class="text-2xl font-semibold mb-7 text-neutral-01">Email sent</div>
        <n-alert v-if="!route.query?.token" title="" type="success" class="bg-neutral-07" style="--n-icon-margin: 18px 8px 0 12px; --n-border: 0">
            <template #icon>
                <i class="i-custom-info"></i>
            </template>
            <div class="text-neutral-04">
                A reset password email has been sent to <span class="text-xl leading-title text-primary">{{ model.email }}</span>
            </div>
        </n-alert>
        <i v-if="route.query?.token" class="inline-block text-3rem text-primary i-custom-check mb-12 "></i>
        <div v-if="route.query?.token" class="text-neutral-01 leading-title mt-7.5">Your password has been changed successfully.</div>
        <!-- <div v-if="!route.query?.token" class="text-1.375rem leading-title text-primary">{{ model.email }}</div> -->
        <div v-if="!route.query?.token" class="text-neutral-04 leading-title mt-7">Please follow the instructions in the email</div>
        
        <div v-if="!route.query?.token">
            <n-button
                type="primary"
                block
                size="large"
                class="mt-4"
                strong
                :loading="pending"
                :disabled="pending"
                @click="requestPassword"
            >Resend the email</n-button>
            <div class="mt-4.5 text-center">
                <nuxt-link to="/login" class="text-primary">Back to sign in</nuxt-link>
            </div>
        </div>
        <n-button
            v-else
            type="primary"
            block
            strong
            size="large"
            class="mt-4"
            ghost
            @click="navigateTo('/login')"
        >Login</n-button>
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
            validator: (rule, value) => value === null || isValidEmail(value),
        },
    ],
    password: [
        {
            required: true,
            message: 'Password is required'
        },
        {
            message: "Password must be at least 8 characters ",
            validator: () => model.value.password.length > 7,
        },
    ],
};

const api = useNAD()
const message = useMessage()
const notify = useNaiveNotification()

async function requestPassword() {
    try {
        await api.request(
            passwordRequest(model.value?.email, '')
        )
        notify.create({
            title: 'Successfully!',
            type: 'success',
            description: 'Password request sent!',
            duration: 3000
        })
        isSubmitted.value = true
    } catch (e) {
        console.log(e)
        isSubmitted.value = false
        notify.create({
            title: 'Failed!',
            type: 'error',
            description: `Please try again`,
            duration: 3000
        })
    }
}

async function resetPassword() {
    try {
        const { data: reseted } = await useAsyncData(() => api.request(
            passwordReset(route.query?.token, model.value?.password)
        ))
        // message.success('Your password has been changed successfully.')
        notify.create({
            title: 'Successfully!',
            type: 'success',
            description: 'Your password has been changed successfully.',
            duration: 3000
        })
        isSubmitted.value = true
    } catch (e) {
        isSubmitted.value = false
        // message.error('Failed! Please try again.')
        notify.create({
            title: 'Failed!',
            type: 'error',
            description: `Please try again`,
            duration: 3000
        })
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
    title: 'Forgot password - Beta - LinkWavePro'
})
</script>

<style lang="scss">
</style>