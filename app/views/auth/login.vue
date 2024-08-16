<template>
    <n-tabs v-model:value="tab" type="segment" size="large" animated @update:value="onChangeTab">
        <n-tab-pane name="login" tab="Sign in" >
            <login-form :email="email"/>
        </n-tab-pane>
        <n-tab-pane name="register" tab="Create account">
            Hey Jude
        </n-tab-pane>
    </n-tabs>
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

const tab = ref('login')

function onChangeTab(tab: string = 'login') {
    navigateTo({
        name: tab
    })
}

useHead({
    title: 'Login - Beta - LinkWavePro'
})
</script>

<style lang="scss">
.n-tabs .n-tabs-rail {
    padding: 4px;
}
</style>
