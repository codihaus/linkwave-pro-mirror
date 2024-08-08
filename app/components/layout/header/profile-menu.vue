<template>
    <div class="lg:min-w-87.5 p-5 rounded-lg bg-white shadow-2xl z-9999 text-dark-01">
        <div class="font-semibold mb-3">My Account</div>
        <div class="flex items-center justify-between gap-3">
            <div class="font-light text-sm">{{ currentUser?.email }}</div>
            <n-button class="" @click="logout">Sign out</n-button>
        </div>
        <!-- <div class="border border-hex-eee rounded-lg mt-3">
            <div class="flex items-center justify-between gap-3 p-3 border-b border-hex-eee">
                <div>Usage</div>
                <div>{{ quota?.remaining }}/{{quota?.current_plan?.max_files_upload}} PDF Files</div>
            </div>
            <div class="flex items-center justify-between gap-3 p-3">
                <div>
                    {{ currentPlan?.name }}
                    <div v-if="nextPaymentDate" class="text-xs">Next Payment on: {{ nextPaymentDate }}</div>
                </div>
                <n-button type="primary" class="" @click="showPricingModal = true">Upgrade</n-button>
            </div>
        </div> -->
    </div>
</template>
<script lang="ts" setup>
import { customEndpoint } from '@directus/sdk';

const currentUser = useState("currentUser")
const showPricingModal = useState('showPricingModal', () => false)
const api = useNAD()
const nuxtApiAuth = useNADAuth()

const analyzeSocket = useState('analyzeSocket')

async function logout() {
    await nuxtApiAuth.logout()
    await analyzeSocket.value?.disconnect()
    await navigateTo('/login')
}

// const { currentPlan, data: plans } = await usePlans()
const currentPlan = useState('currentPlan')

const nextPaymentDate = currentUser.value?.subscription_end_date ? useDateFormat(new Date(currentUser.value?.subscription_end_date), 'DD/MM/YYYY') : false

console.log('currentPlan', currentPlan)

const { data: quota } = await useQuota()
</script>