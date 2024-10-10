// @ts-check
import { defineConfig,envField  } from 'astro/config';
import vercel from '@astrojs/vercel/serverless'

import UnoCSS from 'unocss/astro'
import remarkWikiLink from "./src/plugins/wiki-link/index.ts";
import {getPermalinks} from "./src/plugins/wiki-link/getPermalinks.ts";
import yaml from '@rollup/plugin-yaml'
import expressiveCode from 'astro-expressive-code'
import { ExpressiveCodeTheme } from '@expressive-code/core'

import nightOwlDark from './src/styles/expressive-code/night-owl-dark.json'
import nightOwlLight from './src/styles/expressive-code/night-owl-light.json'

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [yaml()]
    },
    experimental:{
        env: {
            schema: {
                API_URL: envField.string({ context: "server", access: "secret" }),
                API_SECRET: envField.string({ context: "server", access: "secret" }),
            }
        },
        serverIslands: true,
    },

    prefetch: true,
    site: 'https://yuhang.ch',
    scopedStyleStrategy: 'class',
    // trailingSlash: 'always',
    build: {
        format: 'directory'
    },
    markdown:{
        // remarkPlugins: [
        //     [remarkWikiLink, {
        //         permalinks: getPermalinks("src/content/"),
        //         pathFormat: "obsidian-short",
        //         hrefTemplate: (permalink) => {
        //                 return '//////' + permalink;
        //         }
        //     }]
        // ]
    },

    integrations: [
        UnoCSS(),
        expressiveCode({
            themes: [nightOwlDark,nightOwlLight],
            themeCssSelector: (theme) => {
                return '.' + theme.type
            }
        }),
    ],output: 'server',
    adapter: vercel({
        // functionPerRoute: false
    })
});
