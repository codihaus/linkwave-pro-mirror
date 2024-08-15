<template>
    <naive-config :theme-config="themeConfig" :theme="theme">
        <client-only>
            <n-notification-provider placement="top-right" :max="3">
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

const theme = useState('theme', () => null)

const themeConfig = ref<ThemeConfig>({
    shared: {
        common: {
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            // lineHeight: theme.lineHeight.normal,
            fontSize: '16px',
            // borderRadius: '8px',
            // bodyColor: '#0A142C',
            textColorBase: '#141718',
            primaryColor: '#14E3AE',
        },
        Button: {
            heightLarge: '52px',
            paddingLarge: '16px 32px',
            textColorPrimary: '#141718',
            colorHoverPrimary: '#0AA399',
            colorDisabledPrimary:'#AAAAAA',
            borderDisabledPrimary:'1px solid #AAAAAA',
            opacityDisabled: '1',
            fontWeightStrong: '600'
        },
        Divider: {
            color: 'rgba(108, 114, 117, 0.50)',
            textColor: 'rgba(108, 114, 117, 0.50)'
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
            feedbackHeightMedium: '16px',
        },
        Input: {
            heightLarge: '48px',
            borderRadius: '4px',
            color:'#141718',
            colorFocus:'#141718',
            placeholderColor:'#6C7275',
            colorFocusError:'#141718',
            textColor:'#E8ECEF',
            border:'1px solid #343839',
            borderError: '1px solid #D84C10',
            borderHoverError: '1px solid #D84C10',
            borderFocusError: '1px solid #D84C10',
            caretColorError: '1px solid #D84C10',
            feedbackTextColorError: '#D84C10',
        },
        Checkbox: {
            textColor:'#6C7275',
        },
        Layout: {
            siderColor:'transparent',
            siderBorderColor: 'transparent',
            headerColor:'rgba(0,0,0,0.3)',
            headerBorderColor: '#2C2C2C',
            color: '',
            footerColor:'#0A142C',
        },
        Modal: {
            color: '#16203E',
            headerBorderBottom: '1px solid #323C61',
            footerBorderTop: '1px solid #323C61',
            closeIconColor: '#929FBA',
        },
        Pagination: {
            itemTextColor: '#E8ECEF',
            buttonIconColor: '#6C7275',
            buttonColorHover: '#232627',
            buttonIconColorHover: '#14E3AE',
            itemColorDisabled: '#343839',
            itemBorderHover: '1px solid #14E3AE',
            itemBorderDisabled: '1px solid #343839',
            buttonBorder: '1px solid #6C7275',
            buttonBorderHover: '1px solid #14E3AE',
        },
        Scrollbar: {
            color: '#14E3AE',
        },
        Switch: {
            railColor: '#343839',
            railColorActive: '#0084FF'
        },
        Tabs: {
            colorSegment: '#141718',
            tabColorSegment: '#232627',
            tabTextColorSegment: '#6C7275',
            tabTextColorActiveSegment: '#E8ECEF',
            panePaddingLarge: '32px 0 0 0'
        },
        Upload: {
            draggerColor: '#232627',
        },
    },

    light: {
        // common: {
        //     primaryColor: theme.colors.violet[600],
        //     primaryColorHover: theme.colors.violet[500],
        //     primaryColorPressed: theme.colors.violet[700],
        //     borderColor: theme.colors.gray[300]
        // },
        // Card: {
        //     borderColor: theme.colors.gray[300]
        // },
        
    },

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
    title: 'Pro - LinkWaveAI',
    meta: [
        {
            name: 'description',
            content: 'AI-powered Expert to answer the construction regulation & building codes'
        }
    ]
})
</script>
<style lang="scss">
</style>