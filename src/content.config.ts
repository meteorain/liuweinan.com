import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: z.object({
        title: z.string().optional(),
        'title-en': z.string().optional(),
        tags: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional(),
        pubDate: z.coerce.date().optional(),
        lastModified: z.coerce.date().optional(),
        notificationTypes: z.array(z.string()).optional(),
        isDraft: z.boolean().optional(),
        url: z.string().optional(),
    })
});

const docs = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
    schema: z.object({
        title: z.string(),
        hidden: z.boolean().optional(),
        lastModified: z.coerce.date().optional(),
    })
});

const whois = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/whois' }),
    schema: z.object({
        title: z.string().optional(),
    }).loose(),
});

const templates = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/templates' }),
});

export const collections = {
    'posts': posts,
    'docs': docs,
    'whois': whois,
    'templates': templates
};
