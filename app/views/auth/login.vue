<template>
    <div class="w-full flex flex-wrap">
        <div class="auth-img hidden lg:block w-full lg:w-7/12"></div>
        <div class="w-full lg:w-5/12 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <ui-gradient-corner class="w-full lg:max-w-96" wrapper-class="bg-dark-02">
                <continue v-if="!isUserExist" @submit="onSubmit" />
                <login-form v-else :email="email"/>
            </ui-gradient-corner>
        </div>
    </div>
</template>

<script setup lang="ts">
import Continue from './components/continue.vue';
import LoginForm from './components/login-form.vue'


definePageMeta({
	auth: false
})

const isUserExist = ref(false)
const email = ref('')

function onSubmit(event, continueEmail) {
    isUserExist.value = event
    email.value = continueEmail
}

useHead({
    title: 'Login - Beta - LinkWaveAI'
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
