// uno.config.ts
import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
    presetWebFonts,
    transformerDirectives,
    transformerVariantGroup,
    // @ts-ignore
} from "unocss";
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import { presetFluid } from 'unocss-preset-fluid'

export default defineConfig({
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            extraProperties: {
                display: "inline-block",
                color: "inherit",
            },
            prefix: 'i-',
            collections: {
                custom: FileSystemIconLoader(
                    './app/icons',
                    (svg) => {
                        svg = svg.replace(/\s+width="(.*?)"/, '').replace(/\s+height="(.*?)"/, '');
                        svg = svg.replace(/\s+width=\'(.*?)\'/, '').replace(/\s+height=\'(.*?)\'/, '');
                        return svg.search('data-keep') > 0 ? svg.replace('data-keep', '') : svg.replace(/(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/gim, 'currentColor')
                    },
                ),
            },
        }),
        presetTypography(),
        presetWebFonts(),
        presetFluid()
    ],
    transformers: [transformerDirectives(), transformerVariantGroup()],
    shortcuts: [
        {
            "flex-center": "flex items-center justify-center",
            "flex-items": "flex items-center",
            "flex-between": "flex items-center justify-between",
            "flex-start": "flex items-start justify-start",
            "flex-end": "flex items-end justify-end",
            "flex-around": "flex items-center justify-around",
        },
    ],
    theme: {
        colors: {
            primary: "#14E3AE",
            secondary: '#FFC83B',
            heading: '#F0F5FB',
            'heading-02': '#E7E7E7',
            content: '#929FBA',
            'content-02': '#B3BFD5',
            dark: {
                '01': '#16203E',
                '02': '#0A142C',
                '03': '#323C61',
                '04': '#455276',
            }
        },
        fontSize: {},
        container: {
            center: true,
            padding: {
                DEFAULT: "0.9375rem",
                lg: "1.5rem",
                xl: "2rem",
                xxl: "2.5rem",
            },
            maxWidth: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                xxl: "1536px",
            },
        },
        breakpoints: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            xxl: "1536px",
        },
        fontFamily: {},
        backgroundImage: {
            'contest': 'linear-gradient(176.89deg, #FDCC77 5.07%, #F8C157 26.27%, #FABC57 91.59%)'
        },
        lineHeight: {
            title: '1.3'
        }
    },
});
