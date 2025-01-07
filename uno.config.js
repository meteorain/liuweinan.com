// uno.config.ts
import { defineConfig, presetMini,presetUno, presetTypography, transformerDirectives } from 'unocss'

export default defineConfig({
    injectReset: false,
    mode: 'per-module',
    injectEntry: process.env['NODE_ENV'] === 'development',
    transformers: [transformerDirectives()],
    presets: [
        presetUno(),
        presetTypography({
            cssExtend: {
                a: {
                    // no underline
                    'text-decoration': 'none',
                    'font-size': '.9em',
                    // add underline offset
                    textDecorationThickness: '0.2em',
                    textDecorationColor: 'rgb(var(--color-primary-main))',
                },
                'li':{
                    'word-break': 'break-all',
                },
                'li code': {
                    'white-space': 'pre-wrap',
                    'word-break': 'break-word',
                    'margin': '0.2rem',
                    'padding': '0.15em 0.3em',
                    'border-radius': '0.2em',
                    'background-color': 'var(--color-code-bg)'
                },
                'li code::after': {
                    content: 'none'
                },
                'li code::before': {
                    content: 'none'
                },
                'a:hover': {
                    color: 'rgb(var(--color-text-link-hover))'
                },
                'pre,code': {
                    'white-space': 'pre-wrap',
                    'word-break': 'break-word',
                    margin: '0.2rem',
                    padding: '0.15em 0.3em',
                    'border-radius': '0.2em',
                    'background-color': 'var(--color-code-bg)'
                },
                'p code::after': {
                    content: 'none'
                },
                'p code::before': {
                    content: 'none'
                },
                'blockquote p': {
                    'word-break': 'break-all',
                    'margin': '0',
                    'font-size': '0.875rem',
                },
                'blockquote code': {
                    'white-space': 'pre-wrap',
                    'word-break': 'break-word',
                    'margin': '0.2rem',
                    'padding': '0.15em 0.3em',
                    'border-radius': '0.2em',
                    'background-color': 'var(--color-code-bg)'
                }

            }
        })
    ]
})
