<template>
    <client-only>
        <lazy-n-modal v-model:show="showPricingModal" class="py-8">
            <div class="container leading-title">
                <ui-gradient-corner class="relative" wrapper-class="bg-dark-01">
                    <n-button icon type="primary" round class="absolute -top-6.5 -right-6.5 w-13 h-13 bg-white text-primary hover:bg-primary hover:bg-opacity-50" @click="showPricingModal = false">
                        <template #icon>
                            <i class="i-custom-close text-3xl leading-0 flex-shrink-0"></i>
                        </template>
                    </n-button>
                    <div class="p-6 lg:p-10 text-center text-heading">
                        <div class="f-text-18-48 font-semibold leading-title text-primary mt-4.5">
                            Our Pricing Plans
                        </div>
                        <div class="mt-2">Pick an account plan that fits your workflow</div>
                        <div class="flex items-center justify-center gap-4 mt-6">
                            Monthly
                            <n-switch />
                            Annualy
                        </div>
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left items-center mt-6">
                            <ui-gradient-corner v-for="pricingPlan, index in pricingPlans" :class="['pricing-plan', {'recommended': pricingPlan?.recommended}]" :wrapper-class="['h-full',pricingPlan?.recommended ? 'bg-dark-01' : 'bg-dark-02']">
                                <div class="h-full flex flex-col px-3 pt-6 pb-5 lg:px-6">
                                    <div :class="pricingPlan?.recommended ? 'text-xl' : 'text-lg'">{{ pricingPlan?.name }}</div>
                                    <div class="font-semibold text-primary" :class="pricingPlan?.recommended ? 'f-text-26-42' : 'f-text-24-32'">
                                        {{ Number(pricingPlan?.price) > 0 ? `$${pricingPlan?.price}` : 'Free'}}<span v-if="Number(pricingPlan?.price) > 0" class="text-xs">/Month</span>
                                    </div>
                                    <div class="mt-4" :class="pricingPlan?.recommended ? '' : 'text-sm'" v-html="pricingPlan?.description"></div>
                                    <div class="mt-5.5 space-y-2 mb-10">
                                        <div v-for="item in pricingPlan?.plan_meta" class="flex items-center gap-2">
                                            <i class="i-custom-check text-primary"></i>
                                            {{ item }}
                                        </div>
                                    </div>
                                    <div class="mt-auto text-center">
                                        <n-button type="primary" size="large" :loading="loading && pricingPlan?.id === currentSelectedPlan" :disabled="loading || pricingPlan?.id === currentUser?.current_plan?.plan || !Number(pricingPlan?.price)" @click="payNow(pricingPlan)">{{ pricingPlan?.id === currentUser?.current_plan?.plan ? 'Current Plan' : (!Number(pricingPlan?.price) ? 'Free' : '15 days free-trial') }}</n-button>
                                    </div>
                                </div>
                            </ui-gradient-corner>
                        </div>
                    </div>
                </ui-gradient-corner>
            </div>
        </lazy-n-modal>
    </client-only>
</template>

<script setup lang="ts">
import { customEndpoint, readItem, readItems, readSingleton, updateMe } from '@directus/sdk';
import { APIServer } from '~/base/composables/api-server';

const currentUser = useState("currentUser")
const showPricingModal = useState('showPricingModal', () => false)
const api = useNAD()

const pricingTabs = ref([
    {
        name: 'Free',
        price: 'Free',
        description: 'Experience LinkWaveAl risk-free! For the first month, enjoy our Q&A feature at no cost, allowing you to explore how Al can streamline your queries and provide accurate answers.',
        list: [
            'Free',
            'Q&A with AI',
            '3 Files upload and Analyze',
            'Limit 50MB/file'
        ]
    },
    {
        name: 'Standard Plan',
        price: '$9.99',
        recommended: true,
        description: 'Elevate your project management with LinkWaveAl for just $9.99/month. This plan provides full access to our Q&A feature, enabling you to get detailed answers and insights into your project queries.',
        list: [
            'Free in 30 Days',
            'Q&A with AI',
            '5 Files/month upload and Analyze',
            'Limit 100MB/file'
        ],
        id: 'price_1PgIbtRsnESp3u143u5Q3hGj'
    },
    {
        name: 'Gold Plan',
        price: '$19.99',
        description: 'Unlock unlimited potential with LinkWaveAl for $19.99/month. Enjoy unlimited access to the Q&A feature, ensuring continuous support and insights for your projects.',
        list: [
            'Free in 30 Days',
            'Q&A with AI',
            '10 Files/month upload and Analyze',
            'Limit 150MB/file'
        ],
        id: 'price_1PgIcjRsnESp3u14BwWl49BF'
    },
])

// const { data: pricingPlans, pending } = await useAsyncData(
//     'pricingPlans',
//     () => api.request(readItems('plan')),
//     {
//         transform: (response) => response?.items
//     }
// )

const { data: pricingPlans, pending } = await usePlans()

console.log('currentUser', currentUser.value)
console.log('pricingPlans', pricingPlans.value)

const currentSelectedPlan = ref<string | null>(null)


const { data: checkoutInfo, pending: loading, refresh } = await useAsyncData(
    () => {
        return currentSelectedPlan.value ? api.request(customEndpoint({
            path: `/stripe-checkout/${currentSelectedPlan.value}`,
            method: 'POST',
            body: JSON.stringify({quantity: 1}),
        })) : {}
    }, {
        lazy: true,
    }
)

async function payNow(plan: string) {
    if( !plan?.stripe_price_id ) {
        return
    }
    currentSelectedPlan.value = plan?.stripe_price_id
    await refresh()
    if( import.meta.client && checkoutInfo.value?.session?.url ) {
        window.location.href = checkoutInfo.value?.session?.url
    }
}

onMounted(() => {

})
</script>

<style lang="scss">
.pricing-plan {
    &:hover, &.recommended {
        filter: drop-shadow(0px 3.314px 15.824px #000);
    }
}
</style>