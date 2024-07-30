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

            <n-button
                block
                type="primary"
                attr-type="submit"
                :loading="pending"
                :disabled="pending"
                size="large"
                >
                Continue
            </n-button>
            <div class="my-4.5 text-center">or continue with</div>
            <div class="grid grid-cols-2 gap-2">
                <!-- <n-button class="lt-lg:px-4" color="#1877F2" size="large" :style="{'--n-text-color': '#fff', '--n-icon-size': '24px'}">
                    <template #icon>
                        <icons-facebook />
                    </template>
                    Facebook
                </n-button> -->
                <n-button
	                tag="a"
	                href="/api/auth/login/google"
	                class="lt-lg:px-4 col-span-2" color="#fff" text-colorw="#141414" size="large" :style="{'--n-text-color': '#141414', '--n-text-color-hover': '#141414', '--n-color-hover': '#929FBA'}">
                    <icons-google />
                    Google
                </n-button>
            </div>
            <div class="mt-4.5 text-center">
                <nuxt-link :to="{name: 'forgot-password'}" class="text-primary">Forgot password?</nuxt-link>
            </div>
        </n-form>
    </div>
</template>

<script setup lang="ts">
import { readUsers } from '@directus/sdk';
import { APIServer } from '~/base/composables/api-server';

const emit = defineEmits(['submit'])

const model = ref({
    email: null,
});

const { formRef, rules, pending, apiErrors, onSubmit, edited, reset, updateResetValue } = useNaiveForm(model);

rules.value = {
    email: [
        {
            required: true,
            message: "This field is required!",
        },
        {
            required: true,
            message: "Wrong email format!",
            // trigger: ['input', 'blur'],
            validator: (rule, value) => value === null || isValidEmail(value),
        },
    ],
};

const notify = useNaiveNotification()

async function handleSubmit() {
    const client = APIServer.getInstance()
    const result = await client.request(readUsers({
        filter: {
            email: model.value.email
        }
    })).then((users) => {
        console.log('users', users)
        if( users?.[0]?.id ) {
            emit('submit', true, model.value.email)
        } else {
            navigateTo({
                name: 'register',
                query: {
                    email: model.value.email
                }
            })
        }
    }).catch(() =>{
        notify.create({
            title: 'Error',
            type: 'error',
            description: 'Please try again!',
            duration: 3000
        })
    }).finally(() => {
    });
	//
    console.log(result)

}
</script>

<style lang="scss">

</style>
