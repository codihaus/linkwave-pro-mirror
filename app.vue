<template>
    <naive-config :theme-config="themeConfig">
        <client-only>
            <n-notification-provider placement="top-right" max="3">
                <naive-notification />
            </n-notification-provider>
        </client-only>
        <nuxt-loading-indicator :color="themeConfig?.light?.common?.primaryColor" />
        <n-message-provider>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        </n-message-provider>
        <n-modal-provider />
        <n-dialog-provider>
        </n-dialog-provider>
    </naive-config>
</template>
<script lang="ts" setup>
import type { ThemeConfig } from '@bg-dev/nuxt-naiveui'
// import { theme } from '#tailwind-config'
// useDirectusGlobalSeo();

const themeConfig = ref<ThemeConfig>({
    shared: {
        common: {
            fontFamily: 'Kanit, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            // lineHeight: theme.lineHeight.normal,
            fontSize: '16px',
            borderRadius: '8px',
            bodyColor: '#0A142C',
            textColorBase: '#929FBA',
            primaryColor: '#14E3AE',
        },
        Button: {
            heightLarge: '52px',
            paddingLarge: '16px 32px',
            textColorPrimary: '#0A142C',
            colorHoverPrimary: '#0AA399',
            colorDisabledPrimary:'#AAAAAA',
            borderDisabledPrimary:'1px solid #AAAAAA',
            opacityDisabled: '1',
        },
        Drawer: {
            color: '#16203E',
            headerBorderBottom: '1px solid #323C61',
            footerBorderTop: '1px solid #323C61',
            closeIconColor: '#929FBA',
        },
        Menu: {
            itemTextColor: '#e7e7e7',
            itemColorHover: '#14E3AE',
            itemColorActive: '#14E3AE',
        },
        Form: {
            feedbackHeightMedium: '10px',
        },
        Input: {
            heightLarge: '45px',
            borderRadius: '10px',
            color:'#16203E',
            colorFocus:'#16203E',
            placeholderColor:'#929FBA',
            colorFocusError:'#16203E',
            textColor:'#F0F5FB',
            border:'1px solid transparent',
        },
        Checkbox: {
            textColor:'#B3BFD5',
        },
        Layout: {
            siderColor:'transparent',
            siderBorderColor: 'transparent',
            headerColor:'rgba(0,0,0,0.3)',
            headerBorderColor: '#323C61',
            color: '',
            footerColor:'#0A142C',
        },
        Modal: {
            color: '#16203E',
            headerBorderBottom: '1px solid #323C61',
            footerBorderTop: '1px solid #323C61',
            closeIconColor: '#929FBA',
        },
        Scrollbar: {
            color: '#14E3AE',
        },
        
    },

    // light: {
    //     common: {
    //         primaryColor: theme.colors.violet[600],
    //         primaryColorHover: theme.colors.violet[500],
    //         primaryColorPressed: theme.colors.violet[700],
    //         borderColor: theme.colors.gray[300]
    //     },
    //     Card: {
    //         borderColor: theme.colors.gray[300]
    //     }
    // },

    // dark: {
    //     common: {
    //         primaryColor: theme.colors.violet[500],
    //         primaryColorHover: theme.colors.violet[400],
    //         primaryColorPressed: theme.colors.violet[600],
    //         borderColor: theme.colors.gray[800]
    //     },
    //     Card: {
    //         borderColor: theme.colors.gray[800]
    //     }
    // }
})

useHead({
    title: 'Beta - LinkWaveAI',
    meta: [
        {
            name: 'description',
            content: 'AI-powered Expert to answer the construction regulation & building codes'
        }
    ]
})
</script>