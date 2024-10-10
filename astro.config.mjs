// @ts-check
import { defineConfig,envField  } from 'astro/config';
import vercel from '@astrojs/vercel/serverless'

import UnoCSS from 'unocss/astro'
import remarkWikiLink from "./src/plugins/wiki-link/index.ts";
import {getPermalinks} from "./src/plugins/wiki-link/getPermalinks.ts";
import yaml from '@rollup/plugin-yaml'
import expressiveCode from 'astro-expressive-code'

import nightOwlDark from './src/styles/expressive-code/night-owl-dark.json'
import nightOwlLight from './src/styles/expressive-code/night-owl-light.json'

// remark plugins
import {remarkModifiedTime} from './src/plugins/remark-modified-time.mjs'
import remarkDirective from 'remark-directive'
import {RDNotePlugin,RDBilibiliPlugin} from "./src/plugins/remark-directive.mjs";


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

        syntaxHighlight: false,
        remarkRehype: {
            footnoteLabel: ' '
        },
        remarkPlugins: [
            remarkDirective,RDNotePlugin,RDBilibiliPlugin, remarkModifiedTime,
            [remarkWikiLink, {
                permalinks: getPermalinks("src/content/"),
                pathFormat: "obsidian-short",
                hrefTemplate: (permalink) => {
                    const href =  permalink.replaceAll("src/content/", "/") + '/';
                    if (!href.startsWith('/'))
                        return '/' + href;
                    return href;
                }
            }]
        ]
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
