import { z, defineCollection } from 'astro:content';



const posts = defineCollection({
    type: 'content', // v2.5.0 and later
    schema: z.object({
        title: z.string().optional(),
        'title-en': z.string().optional(),
        tags: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional(),
        pubDate:z.date().optional(),
        lastModified: z.date().optional(),
        notificationTypes: z.array(z.string()).optional(),
        isDraft: z.boolean().optional(),
        url: z.string().optional(),
    })
});

const postsEn = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string().optional(),
        'title-en': z.string().optional(),
        tags: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional(),
        pubDate: z.date().optional(),
        lastModified: z.date().optional(),
        notificationTypes: z.array(z.string()).optional(),
        isDraft: z.boolean().optional(),
        url: z.string().optional(),
    })
});

const docs = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        hidden: z.boolean().optional(),
        lastModified: z.date().optional(),
    })
});

const whois = defineCollection({
    type: 'content',
    schema: z.object({
        lang: z.enum(['zh', 'en']).default('zh'),
        title: z.string().optional(),
    }).passthrough(),
});

const templates = defineCollection({})


const now = defineCollection({
    type: 'content',
});



export const collections = {
    'posts': posts,
    'posts-en': postsEn,
    'docs': docs,
    // 'now': now,
    'whois': whois,
    'templates': templates
};