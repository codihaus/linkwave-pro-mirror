<template>
    <div class="px-8 py-10">
        <div class="text-center"><layout-logo class="inline-block"/></div>
        <n-form
            class="mt-6"
            ref="formRef"
            :rules="rules"
            :model="model"
            @submit.prevent="() => onSubmit(handleSubmit)"
        >
            <n-form-item :show-label="false" label="Email" path="email">
                <n-input v-model:value="model.email" size="large" placeholder="Email address"></n-input>
            </n-form-item>
            <n-form-item :show-label="false" path="password" label="Password">
                <n-input v-model:value="model.password" size="large" type="password" placeholder="Enter password"></n-input>
            </n-form-item>
            <n-button
                block
                type="primary"
                attr-type="submit"
                :loading="pending"
                :disabled="pending"
                size="large"
                >
                Sign in
            </n-button>
            <div class="mt-4.5 text-center">
                <nuxt-link :to="{name: 'forgot-password'}" class="text-primary">Forgot password?</nuxt-link>
            </div>
        </n-form>
    </div>
</template>

<script setup lang="ts">
import {COOKIE_TOKEN, COOKIE_REFRESH_TOKEN} from "~/base/server/utils/directus.token";

const props = withDefaults(
    defineProps<{
        email: string
    }>(),
    {
        email: ''
    }
)

const model = ref({
    email: props.email,
    password: "",
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

const nuxtApiAuth = useNADAuth()
const notify = useNaiveNotification()
const message = useMessage()

const accessToken = useState("accessToken", () => "")

async function handleSubmit() {
    const response = await nuxtApiAuth.login(model.value.email, model.value.password)
    console.log('response login', response)

    if( ! response?.user?.id ) {
        apiErrors.value.wrongCredentials = true;
        notify.create({
            title: 'Error',
            type: 'error',
            description: 'Wrong credentials. Please try again!',
            duration: 3000
        })

    } else {
        accessToken.value = response?.access_token

        message.success("Logged in successfully!")
        navigateTo({
            name: 'home'
        })
    }

}
</script>

<style lang="scss">

</style>