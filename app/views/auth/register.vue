<template>
    <n-tabs v-model:value="tab" type="segment" size="large" animated @update:value="onChangeTab">
        <n-tab-pane name="login" tab="Sign in" >
            
        </n-tab-pane>
        <n-tab-pane name="register" tab="Create account">
            <n-button
                v-if="!success"
                tag="a"
                block
                href="/api/auth/login/google"
                class="lt-lg:px-4 col-span-2 text-neutral-01 font-semibold" size="large" :style="{'--n-border': '2px solid #343839'}">
                <icons-google class="mr-4" />
                Continue with Google
            </n-button>
            <n-divider v-if="!success">
                OR
            </n-divider>
            <n-form
                v-if="!success"
                class="mt-6"
                ref="formRef"
                :rules="rules"
                :model="model"
                @submit.prevent="() => onSubmit(handleSubmit)"
            >
                <n-grid :span="24" :x-gap="10">
                    <n-form-item-gi :span="12" :show-label="false" label="First name" path="first_name">
                        <n-input v-model:value="model.first_name" size="large" placeholder="First name" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" :show-label="false" label="Last name" path="last_name">
                        <n-input v-model:value="model.last_name" size="large" placeholder="Last name" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" :show-label="false" label="Phone number" path="phone">
                        <n-input v-model:value="model.phone" size="large" placeholder="Phone number" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" :show-label="false" label="Company" path="company">
                        <n-input v-model:value="model.company" size="large" placeholder="Company" />
                    </n-form-item-gi>
                </n-grid>
                
                <n-form-item :show-label="false" label="Register for purpose" path="register_for_purpose">
                    <n-select
                        v-model:value="model.register_for_purpose"
                        placeholder="Register for purpose"
                        :options="purposeOptions"
                        size="large"
                    />
                </n-form-item>
                <n-form-item :show-label="false" label="Email" path="email">
                    <n-input v-model:value="model.email" size="large" placeholder="Email address"></n-input>
                </n-form-item>
                <n-form-item :show-label="false" path="password" label="Password">
                    <n-input v-model:value="model.password" size="large" type="password" placeholder="Password (at least 8 characters)"></n-input>
                </n-form-item>
                <n-form-item :show-label="false" path="retype_password" label="Re-type Password">
                    <n-input v-model:value="model.retype_password" size="large" type="password" placeholder="Re-type password"></n-input>
                </n-form-item>
                <n-form-item :show-label="false" path="allow_term">
                    <n-checkbox v-model:checked="model.allow_term" class="text-neutral-04">I consent to receive marketing communications such as emails and SMS from LinkwaveAI as well as to its Terms of Service and Privacy Policy.</n-checkbox>
                </n-form-item>
                <n-button
                    block
                    type="primary"
                    attr-type="submit"
                    :loading="pending"
                    :disabled="submittable"
                    size="large"
                    class="mt-1.5"
                    >
                    Sign up
                </n-button>
                <div class="mt-4.5 text-center">
                    <nuxt-link :to="{name: 'forgot-password'}" class="text-primary">Forgot password?</nuxt-link>
                </div>
            </n-form>
        </n-tab-pane>
    </n-tabs>
    <div v-if="success" class="mt-6">
        <div class="inline-block bg-primary rounded-full p-10 leading-0">
            <i class="inline-block text-3rem text-neutral-07 i-custom-check"></i>
        </div>
        <div class="text-heading leading-title mt-7.5 text-lg lg:text-2xl font-bold">Your account has been created successfully!</div>
        <n-button
            type="primary"
            block
            size="large"
            class="mt-4"
            @click="navigateTo('/login')"
        >Let’s Start</n-button>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
	auth: false
})

const route = useRoute()

const tab = ref('register')

function onChangeTab(tab: string = 'register') {
    navigateTo({
        name: tab
    })
}

const model = ref({
    first_name: "",
    last_name: "",
    phone: "",
    company: "",
    register_for_purpose: "Personal",
    email: route?.query?.email || "",
    password: "",
    retype_password: "",
    allow_term: false
});

const purposeOptions = [
    {
        label: 'Personal',
        value: 'Personal'
    },
    {
        label: 'Business',
        value: 'Business'
    },
]

const { formRef, rules, pending, apiErrors, onSubmit, edited, reset, updateResetValue } = useNaiveForm(model);

rules.value = {
    first_name: [
        {
            required: true,
            message: "Fist name is required",
        },
    ],
    email: [
        {
            required: true,
            message: "Wrong email format!",
            // trigger: ['input', 'blur'],
            validator: (rule, value) => isValidEmail(value),
        },
        {
            message: "Wrong credentials",
            validator: () => !apiErrors.value.wrongCredentials,
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
    retype_password: [
        {
            message: "Re-type password doesn't match",
            validator: () => model.value.password === model.value.retype_password,
        },
    ],
    allow_term: [
        {
            required: true,
            message: 'You need to apcept this'
        },
    ],
};

const submittable = computed(() => !model.value.first_name || !model.value.email || !model.value.password || !model.value.retype_password || !model.value.allow_term || pending.value)

const success = ref(false)
const nuxtApiAuth = useNADAuth()
const notify = useNaiveNotification()

async function handleSubmit() {

    const credentials = {
        ...model.value,
        role: useRuntimeConfig().app.default_role
    }

    delete credentials.retype_password
    delete credentials.allow_term

    const response = await nuxtApiAuth.register(credentials).then(() => {
        success.value = true
    }).catch(() => {
        notify.create({
            title: 'Error',
            type: 'error',
            description: 'Please try again!'
        })
    })
}

useHead({
    title: 'Register - Beta - LinkWaveAI'
})
</script>

<style lang="scss">
.auth-img {
    background-image: url('/images/auth-bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top center;
    border-right: 4px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(180deg, #14E3AE 0%, rgba(20, 227, 174, 0) 100%);

}
</style>