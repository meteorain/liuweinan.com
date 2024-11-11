// @ts-check
import {defineConfig, envField} from 'astro/config';
import vercel from '@astrojs/vercel/serverless'

import UnoCSS from 'unocss/astro'
import remarkWikiLink from "./src/plugins/wiki-link/index.ts";
import {getPermalinks} from "./src/plugins/wiki-link/getPermalinks.ts";
import yaml from '@rollup/plugin-yaml'
import expressiveCode from 'astro-expressive-code'

import nightOwlDark from './src/styles/expressive-code/night-owl-dark.json'
import nightOwlLight from './src/styles/expressive-code/night-owl-light.json'

import {remarkModifiedTime} from './src/plugins/remark-modified-time.mjs'
import remarkDirective from 'remark-directive'
import { RDBilibiliPlugin} from "./src/plugins/remark-directive.mjs";
import {InternalLinkPlugin} from "./src/plugins/remark-internal-link.mjs";
import remarkObsidianCallout from './src/plugins/callout/index.js'
import mdx from "@astrojs/mdx";


// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [yaml()],
        build:{
            assets: 'assets',
        }
    },
    compressHTML:false,
    experimental: {
        env: {
            schema: {
                API_URL: envField.string({context: "server", access: "secret"}),
                API_SECRET: envField.string({context: "server", access: "secret"}),
                STUDIO_SECRET: envField.string({context: "server", access: "secret"}),
            }
        },
        serverIslands: true,
    },
    trailingSlash: 'never',
    // prefetch: true,
    site: 'https://liuweinancom.vercel.app',
    scopedStyleStrategy: 'class',
    // trailingSlash: 'always',
    build: {
        format: 'directory'
    },
    markdown: {

        syntaxHighlight: false,
        remarkRehype: {
            footnoteLabel: ' '
        },
        remarkPlugins: [
            remarkDirective,
            // RDNotePlugin,
            [
                remarkObsidianCallout,
                {
                    blockquoteClass:'callout',
                    titleTextTagName: "span",
                    iconTagName: "span",
                    // ...
                },
            ],
            RDBilibiliPlugin,
            InternalLinkPlugin,
                [remarkWikiLink, {
                permalinks: getPermalinks("src/content/"),
                pathFormat: "obsidian-short",
                hrefTemplate: (permalink) => {
                    const href = permalink.replaceAll("src/content/", "/") + '/';
                    if (!href.startsWith('/'))
                        return '/' + href;
                    return href;
                }
            }],
            remarkModifiedTime,

        ]
    },

    integrations: [
        UnoCSS(),
        expressiveCode({
            themes: [nightOwlDark, nightOwlLight],
            themeCssSelector: (theme) => {
                return '.' + theme.type
            }
        }),
        mdx(),
    ], output: 'server',
    adapter: vercel({
        // functionPerRoute: false
    })
});
