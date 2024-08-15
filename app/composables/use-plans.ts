import { readItems } from '@directus/sdk'

export async function usePlans(options = {}) {
    const api = useNAD()
    const currentUser = useState("currentUser")
    const currentPlan = useState('currentPlan')

    const plans = await useAsyncData(
        'pricingPlans',
        () => api.request(readItems('plan', {
            fields: [
                'id', 'name', 'price', 'description', 'is_default', 'recommended',
                'unit',
                'max_files_upload', 'max_size_upload', 'plan_meta.meta_value',
                'stripe_price_id', 'stripe_product_id',
            ]
        })),
        {
            transform: (response) => {
                return response?.items?.map((plan) => {
                    plan = {
                        ...plan,
                        plan_meta: plan?.plan_meta?.map((meta) => meta?.meta_value)
                    }

                    if( plan?.is_default ) {
                        currentPlan.value = plan
                    }
                    if( plan?.id === currentUser.value?.current_plan?.plan ) {
                        currentPlan.value = plan
                    }
                    return plan
                })
            },
            lazy: true,
            ...options,
        }
    )

    

    return {
        ...plans,
        currentPlan
    }
}