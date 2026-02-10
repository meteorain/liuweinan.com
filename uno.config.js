/**
 * UnoCSS Configuration
 * 
 * This file handles simple prose typography extensions via presetTypography.
 * 
 * Note: Complex prose styles (links with internal/external handling, blockquote containers,
 * callout components, animations) are handled in src/styles/content.css.
 * 
 * This config focuses on:
 * - Simple code block styling (pre, code, li code, blockquote code)
 * - List item word-break handling
 * - Blockquote paragraph styling
 * 
 * Do NOT add 'a' tag styles here - they are handled by content.css with complex selectors.
 */
import { defineConfig, presetMini, presetTypography, transformerDirectives } from 'unocss'

export default defineConfig({
    injectReset: false,
    mode: 'per-module',
    injectEntry: process.env['NODE_ENV'] === 'development',
    transformers: [transformerDirectives()],
    presets: [
        presetMini(),
        presetTypography({
            cssExtend: {
                // List item word-break handling
                'li': {
                    'word-break': 'break-all',
                },
                // Code styling in lists
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
                // General code block styling
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
                // Blockquote content styling (container styles are in content.css)
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
