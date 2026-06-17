import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// 基于上游 yuhangch/yuhang.ch 的 content.config.ts。
// posts 增加一个“转换器”：把重导出 md 的 AstroPaper 风格字段
// （pubDatetime / tags / draft / modDatetime ...）映射成站点组件使用的字段
// （pubDate / categories / isDraft / lastModified），同时保留全部原始信息。
const postSchema = z
    .object({
        title: z.string().optional(),
        'title-en': z.string().optional(),
        tags: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional(),
        pubDate: z.coerce.date().optional(),
        lastModified: z.coerce.date().optional(),
        notificationTypes: z.array(z.string()).optional(),
        isDraft: z.boolean().optional(),
        url: z.string().optional(),
        // —— 重导出新增字段（AstroPaper 风格 + 归档信息），全部保留 ——
        pubDatetime: z.coerce.date().optional(),
        modDatetime: z.coerce.date().optional().nullable(),
        draft: z.boolean().optional(),
        author: z.string().optional(),
        description: z.string().optional(),
        featured: z.boolean().optional(),
        legacy: z.any().optional(),
        diary: z.any().optional(),
        comments: z.array(z.any()).optional(),
    })
    .transform((d) => ({
        ...d,
        pubDate: d.pubDate ?? d.pubDatetime,
        lastModified: d.lastModified ?? d.modDatetime ?? undefined,
        categories: d.categories ?? [],
        tags: d.tags ?? [],
        isDraft: d.isDraft ?? d.draft ?? false,
    }));

const posts = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: postSchema,
});

const docs = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
    schema: z.object({
        title: z.string(),
        hidden: z.boolean().optional(),
        lastModified: z.coerce.date().optional(),
    }),
});

const whois = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/whois' }),
    schema: z
        .object({
            lang: z.enum(['zh', 'en']).default('zh'),
            title: z.string().optional(),
        })
        .loose(),
});

const templates = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/templates' }),
});

export const collections = { posts, docs, whois, templates };
