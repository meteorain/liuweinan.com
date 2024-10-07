// @ts-check
import { defineConfig } from 'astro/config';

import UnoCSS from 'unocss/astro'
import remarkWikiLink from "./src/plugins/wiki-link/index.ts";
import {getPermalinks} from "./src/plugins/wiki-link/getPermalinks.ts";
import yaml from '@rollup/plugin-yaml'
import expressiveCode from 'astro-expressive-code'
import { ExpressiveCodeTheme } from '@expressive-code/core'

const nightOwlDark = new ExpressiveCodeTheme('./src/styles/expressive-code/night-owl-dark.json')
const nightOwlLight = new ExpressiveCodeTheme('./src/styles/expressive-code/night-owl-light.json')

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [yaml()]
    },

    prefetch: true,
    site: 'https://yuhang.ch',
    scopedStyleStrategy: 'class',
    trailingSlash: 'always',
    build: {
        format: 'directory'
    },
    markdown:{
        remarkPlugins: [
            [remarkWikiLink, {
                permalinks: getPermalinks("src/content/"),
                pathFormat: "obsidian-short",
                hrefTemplate: (permalink) => {
                    return  permalink.replaceAll("src/content/", "/") + '/';
                }
            }]
        ]
    },

    integrations: [
        UnoCSS(),
        expressiveCode({
            themes: ['vitesse-dark','snazzy-light'],
            themeCssSelector: (theme) => {
                return '.' + theme.type
            }
        }),
    ],
});
